'use client';

import { useEffect, useRef, useState } from 'react';

export default function OceanWavesGPGPU() {
  const containerRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(false);
  const timeRef = useRef(0);
  const resetTimeRef = useRef(null);

  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer, scene, camera, controls;
    let waterMesh, meshRay;
    let gpuCompute, heightmapVariable;
    let animationId;

    const WIDTH = 256; // Higher resolution for ocean
    const BOUNDS = 50; // Much larger area for ocean view
    const BOUNDS_HALF = BOUNDS * 0.5;

    let mousedown = false;
    const mouseCoords = { x: 0, y: 0 };
    let frame = 0;

    // Expose reset function
    resetTimeRef.current = () => {
      timeRef.current = 0;
    };

    const effectController = {
      mouseSize: 1.0,
      mouseDeep: 0.3,
      viscosity: 0.995, // Higher viscosity to maintain wave coherence
      speed: 1,
      waveSpeed: 0.3, // Slower wave speed to match slowed simulation
      waveHeight: 0.18, // Wave amplitude
      shoreDistance: 0.15, // Breaking point near shore (foreground)
      gravity: 0.015, // Gravity coefficient for shallow water effects
      beachSlope: 0.25, // Gentler bottom slope
    };

    async function init() {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      const { GPUComputationRenderer } = await import('three/examples/jsm/misc/GPUComputationRenderer.js');

      // Setup renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Setup scene with tropical sky background
      scene = new THREE.Scene();
      const skyColor = new THREE.Color(0x87ceeb); // Light sky blue
      const horizonColor = new THREE.Color(0xadd8e6); // Light blue horizon
      scene.background = skyColor;
      scene.fog = new THREE.Fog(horizonColor, 15, 120);

      // Setup camera - lower angle to see horizon
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
      camera.position.set(0, 3, 10);
      camera.lookAt(0, 0, -20);

      // Setup controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, -10);
      controls.maxPolarAngle = Math.PI * 0.55;
      controls.minDistance = 5;
      controls.maxDistance = 50;

      // Add lighting for tropical water appearance
      const sun = new THREE.DirectionalLight(0xffffff, 3.5);
      sun.position.set(-10, 25, -10);
      scene.add(sun);

      const ambientLight = new THREE.AmbientLight(0x87ceeb, 2.5); // Sky blue ambient
      scene.add(ambientLight);

      // Initialize water
      initWater(THREE, GPUComputationRenderer);

      // Mouse event listeners
      const canvas = renderer.domElement;
      canvas.addEventListener('pointerdown', () => { mousedown = true; });
      canvas.addEventListener('pointerup', () => { mousedown = false; controls.enabled = true; });
      canvas.addEventListener('pointermove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseCoords.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoords.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      });

      // Window resize
      window.addEventListener('resize', onWindowResize);

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      // Animation loop
      function animate() {
        animationId = requestAnimationFrame(animate);

        if (runningRef.current) {
          timeRef.current += 0.008; // Slowed down to half speed
        }

        // Always render to show the wave state
        render(THREE);
      }

      animate();
    }

    function initWater(THREE, GPUComputationRenderer) {
      // Ocean geometry - elongated rectangle
      const geometry = new THREE.PlaneGeometry(BOUNDS * 2, BOUNDS * 3, WIDTH - 1, WIDTH - 1);

      // Water material with tropical blue color
      const material = new THREE.MeshStandardMaterial({
        color: 0x00bfff, // Bright tropical blue (deep sky blue)
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        emissive: 0x003355, // Slight blue glow
        emissiveIntensity: 0.2
      });

      waterMesh = new THREE.Mesh(geometry, material);
      waterMesh.rotation.x = -Math.PI * 0.5;
      waterMesh.position.z = -BOUNDS * 0.5;
      waterMesh.matrixAutoUpdate = false;
      waterMesh.updateMatrix();
      scene.add(waterMesh);

      // Ray mesh for mouse interaction
      const geometryRay = new THREE.PlaneGeometry(BOUNDS * 2, BOUNDS * 3, 1, 1);
      meshRay = new THREE.Mesh(
        geometryRay,
        new THREE.MeshBasicMaterial({ visible: false })
      );
      meshRay.rotation.x = -Math.PI / 2;
      meshRay.position.z = -BOUNDS * 0.5;
      meshRay.matrixAutoUpdate = false;
      meshRay.updateMatrix();
      scene.add(meshRay);

      // GPU Computation setup
      gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

      const heightmap0 = gpuCompute.createTexture();
      fillTexture(heightmap0);

      const heightmapFragmentShader = `
        #include <common>

        uniform vec2 mousePos;
        uniform float mouseSize;
        uniform float viscosity;
        uniform float deep;
        uniform float time;
        uniform float waveSpeed;
        uniform float waveHeight;
        uniform float shoreDistance;
        uniform float gravity;
        uniform float beachSlope;

        // Smooth noise function for natural wave patterns
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));

          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vec2 cellSize = 1.0 / resolution.xy;
          vec2 uv = gl_FragCoord.xy * cellSize;

          vec4 heightmapValue = texture2D(heightmap, uv);

          // Sample neighbors for wave propagation
          vec4 north = texture2D(heightmap, uv + vec2(0.0, cellSize.y));
          vec4 south = texture2D(heightmap, uv + vec2(0.0, -cellSize.y));
          vec4 east = texture2D(heightmap, uv + vec2(cellSize.x, 0.0));
          vec4 west = texture2D(heightmap, uv + vec2(-cellSize.x, 0.0));

          // Additional neighbors for smoother propagation
          vec4 northeast = texture2D(heightmap, uv + vec2(cellSize.x, cellSize.y));
          vec4 northwest = texture2D(heightmap, uv + vec2(-cellSize.x, cellSize.y));
          vec4 southeast = texture2D(heightmap, uv + vec2(cellSize.x, -cellSize.y));
          vec4 southwest = texture2D(heightmap, uv + vec2(-cellSize.x, -cellSize.y));

          // Directional wave propagation from horizon (north) toward shore (south)
          // Balanced to maintain wave coherence while still being directional
          float northWeight = 0.40;    // Strong influence from horizon
          float southWeight = 0.08;    // Some backward for stability
          float eastWeight = 0.18;     // Side spreading
          float westWeight = 0.18;     // Side spreading
          float neWeight = 0.06;       // Diagonal forward
          float nwWeight = 0.06;       // Diagonal forward
          float seWeight = 0.02;       // Minimal diagonal back
          float swWeight = 0.02;       // Minimal diagonal back

          float neighborAvg =
            north.x * northWeight +
            south.x * southWeight +
            east.x * eastWeight +
            west.x * westWeight +
            northeast.x * neWeight +
            northwest.x * nwWeight +
            southeast.x * seWeight +
            southwest.x * swWeight;

          // Distance from shore (bottom = 0, top = 1)
          float distanceFromShore = uv.y;

          // Bottom topography: deeper at horizon (y=1), shallow at shore (y=0)
          // B represents the virtual seafloor height
          float bottomDepth = (1.0 - distanceFromShore) * beachSlope;

          // Effective water depth above bottom
          float waterDepth = max(0.01, 1.0 - bottomDepth);

          // Wave equation with shallow water modifications
          float newHeight = (neighborAvg * 2.0 - heightmapValue.y) * viscosity;

          // Shallow water effect: waves slow down in shallow areas
          // Speed is proportional to sqrt(depth)
          float waveSpeed = sqrt(waterDepth * gravity);
          newHeight *= (0.5 + 0.5 * waveSpeed / 0.12); // Normalize around typical speed

          // Apply gentle global damping to prevent energy buildup
          // Keep damping minimal to maintain wave coherence
          float dampingFactor = 0.9995; // Very gentle

          // Only increase damping significantly near shore where breaking occurs
          if (distanceFromShore < 0.3) {
            dampingFactor = 0.997; // Moderate damping near shore
          }
          if (distanceFromShore < 0.1) {
            dampingFactor = 0.994; // Stronger at immediate shore
          }

          newHeight *= dampingFactor;

          // Generate ONE SINGLE coherent wave band at horizon
          // Only active for a very brief moment to inject one wave
          if (distanceFromShore > 0.94 && time > 0.15 && time < 0.35) {
            float horizonBlend = smoothstep(0.94, 0.98, distanceFromShore);

            // Ultra-narrow time pulse centered at 0.25 seconds
            float timePeak = 0.25;
            float timeWidth = 0.08; // Very narrow
            float timeOffset = time - timePeak;
            float waveEnvelope = exp(-((timeOffset * timeOffset) / (2.0 * timeWidth * timeWidth)));

            // Single uniform wave crest across ENTIRE width (no x-variation)
            // This creates a straight wave front rather than localized hump
            float waveAmplitude = waveHeight * waveEnvelope * horizonBlend;

            // Add wave uniformly across width for coherent front
            newHeight += waveAmplitude;
          }

          // Wave shoaling: In shallow water, energy concentrates and amplitude increases
          // Based on shallow water theory: amplitude ~ depth^(-1/4)
          // Apply gently to maintain wave coherence
          float deepWaterDepth = 1.0; // Reference depth at horizon
          float shoalingCoeff = pow(deepWaterDepth / waterDepth, 0.2); // Reduced exponent for gentler effect

          // Limit shoaling to realistic values and apply smoothly
          shoalingCoeff = clamp(shoalingCoeff, 1.0, 1.5); // Reduced max amplification

          // Apply shoaling effect only in shallow areas
          if (waterDepth < 0.8) {
            newHeight *= shoalingCoeff;
          }

          // Calculate wave steepness for breaking detection
          float heightDiff = abs(north.x - south.x);
          float steepness = heightDiff / cellSize.y;

          // Shallow water breaking criterion: wave breaks when H/h > 0.78
          // H is wave height (2 * amplitude), h is water depth
          float waveAmplitude = abs(newHeight);
          float breakingRatio = (2.0 * waveAmplitude) / waterDepth;

          // Breaking threshold based on depth
          float depthBreakingThreshold = 0.5; // Adjusted for our scale

          // Steepness breaking
          float steepnessBreakingThreshold = 8.0;

          // Combined breaking intensity
          float depthBreaking = smoothstep(depthBreakingThreshold * 0.8, depthBreakingThreshold * 1.5, breakingRatio);
          float slopeBreaking = smoothstep(steepnessBreakingThreshold * 0.7, steepnessBreakingThreshold * 1.3, steepness);

          float breakingIntensity = max(depthBreaking, slopeBreaking);

          // Apply breaking in shallow areas
          if (waterDepth < 0.6 && breakingIntensity > 0.15) {
            // Energy dissipation due to breaking
            newHeight *= (1.0 - breakingIntensity * 0.3);

            // Minimal turbulent mixing - just enough for foam, not fragmenting waves
            float turbulence = (noise(uv * 30.0 + time * 1.0) - 0.5) * 0.03 * breakingIntensity;
            newHeight += turbulence;

            // Store breaking intensity for foam rendering (use z channel)
            heightmapValue.z = max(heightmapValue.z, breakingIntensity);
          } else {
            // Foam decays over time
            heightmapValue.z *= 0.94;
          }

          // Mouse interaction (optional)
          float mousePhase = clamp(length((uv - vec2(0.5)) * ${BOUNDS.toFixed(1)} - vec2(mousePos.x, -mousePos.y)) * PI / mouseSize, 0.0, PI);
          newHeight -= (cos(mousePhase) + 1.0) * deep;

          // Edge damping to prevent reflections and instability
          float edgeDamping = 1.0;
          float edgeWidth = 0.03; // Narrower edge damping zone
          if (uv.x < edgeWidth || uv.x > 1.0 - edgeWidth || uv.y < edgeWidth) {
            float distToEdge = min(min(uv.x, 1.0 - uv.x), uv.y);
            edgeDamping = smoothstep(0.0, edgeWidth, distToEdge);
            // Gentler damping at edges
            newHeight *= mix(0.5, 1.0, edgeDamping);
          }

          // Soft limiting to prevent extreme values while preserving natural wave shapes
          // Only apply limiting to values outside normal range
          float normalRange = 0.25;
          float maxRange = 0.4;

          if (abs(newHeight) > normalRange) {
            float excess = abs(newHeight) - normalRange;
            float limitedExcess = normalRange * tanh(excess / normalRange);
            newHeight = sign(newHeight) * (normalRange + limitedExcess);
          }

          // Hard limit for safety
          newHeight = clamp(newHeight, -maxRange, maxRange);

          // Update heightmap values
          // x = current height, y = previous height, z = foam/breaking intensity
          heightmapValue.y = heightmapValue.x;
          heightmapValue.x = newHeight;
          // z already set in breaking section

          gl_FragColor = heightmapValue;
        }
      `;

      heightmapVariable = gpuCompute.addVariable('heightmap', heightmapFragmentShader, heightmap0);
      gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);

      heightmapVariable.material.uniforms['mousePos'] = { value: new THREE.Vector2(10000, 10000) };
      heightmapVariable.material.uniforms['mouseSize'] = { value: effectController.mouseSize };
      heightmapVariable.material.uniforms['viscosity'] = { value: effectController.viscosity };
      heightmapVariable.material.uniforms['deep'] = { value: effectController.mouseDeep };
      heightmapVariable.material.uniforms['time'] = { value: 0 };
      heightmapVariable.material.uniforms['waveSpeed'] = { value: effectController.waveSpeed };
      heightmapVariable.material.uniforms['waveHeight'] = { value: effectController.waveHeight };
      heightmapVariable.material.uniforms['shoreDistance'] = { value: effectController.shoreDistance };
      heightmapVariable.material.uniforms['gravity'] = { value: effectController.gravity };
      heightmapVariable.material.uniforms['beachSlope'] = { value: effectController.beachSlope };

      const error = gpuCompute.init();
      if (error !== null) {
        console.error('GPUComputationRenderer error:', error);
      }

      // Custom shader for water mesh with foam
      material.onBeforeCompile = (shader) => {
        shader.uniforms.heightmap = { value: null };
        shader.uniforms.WIDTH = { value: WIDTH };
        shader.uniforms.BOUNDS = { value: BOUNDS };

        shader.vertexShader = `
          uniform sampler2D heightmap;
          uniform float WIDTH;
          uniform float BOUNDS;
          varying float vHeight;
          varying float vFoam;
          ${shader.vertexShader}
        `;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <beginnormal_vertex>',
          `
            vec2 cellSize = vec2(1.0 / WIDTH, 1.0 / WIDTH);
            float heightN = texture2D(heightmap, uv + vec2(0, cellSize.y)).x;
            float heightS = texture2D(heightmap, uv - vec2(0, cellSize.y)).x;
            float heightE = texture2D(heightmap, uv + vec2(cellSize.x, 0)).x;
            float heightW = texture2D(heightmap, uv - vec2(cellSize.x, 0)).x;

            // Calculate normals with gentle steepness for natural appearance
            float normalScale = 1.0;
            vec3 objectNormal = normalize(vec3(
              (heightW - heightE) * WIDTH / BOUNDS * normalScale,
              (heightS - heightN) * WIDTH / BOUNDS * normalScale,
              1.0
            ));
          `
        );

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
            vec4 heightData = texture2D(heightmap, uv);
            float heightValue = heightData.x;
            float foamValue = heightData.z;
            vHeight = heightValue;
            vFoam = foamValue;
            vec3 transformed = vec3(position.x, position.y, heightValue);
          `
        );

        // Add foam for breaking waves
        shader.fragmentShader = `
          varying float vHeight;
          varying float vFoam;
          ${shader.fragmentShader}
        `;

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <color_fragment>',
          `
            #include <color_fragment>

            // White water foam from breaking waves
            // Primary foam from breaking intensity
            float breakingFoam = clamp(vFoam, 0.0, 1.0);

            // Secondary foam from wave height (crests)
            float heightFoam = smoothstep(0.10, 0.25, abs(vHeight));

            // Combined foam intensity
            float totalFoam = clamp(breakingFoam + heightFoam * 0.5, 0.0, 1.0);

            // Bright white foam for tropical water contrast
            vec3 foamColor = vec3(1.0, 1.0, 1.0);

            // Blend foam with water color
            diffuseColor.rgb = mix(diffuseColor.rgb, foamColor, totalFoam * 0.85);

            // Add extra brightness to breaking foam
            if (breakingFoam > 0.3) {
              diffuseColor.rgb += vec3(0.15) * breakingFoam;
            }
          `
        );

        waterMesh.material.userData.shader = shader;
      };
    }

    function fillTexture(texture) {
      const pixels = texture.image.data;
      let p = 0;
      for (let j = 0; j < WIDTH; j++) {
        for (let i = 0; i < WIDTH; i++) {
          // Start with small random noise
          pixels[p + 0] = (Math.random() - 0.5) * 0.01;
          pixels[p + 1] = pixels[p + 0];
          pixels[p + 2] = 0;
          pixels[p + 3] = 1;
          p += 4;
        }
      }
    }

    function render(THREE) {
      // Mouse raycasting
      if (mousedown && meshRay) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseCoords.x, mouseCoords.y), camera);
        const intersects = raycaster.intersectObject(meshRay);

        if (intersects.length > 0) {
          const point = intersects[0].point;
          heightmapVariable.material.uniforms['mousePos'].value.set(point.x, point.z);
          if (controls.enabled) controls.enabled = false;
        } else {
          heightmapVariable.material.uniforms['mousePos'].value.set(10000, 10000);
        }
      } else {
        heightmapVariable.material.uniforms['mousePos'].value.set(10000, 10000);
      }

      // Update time uniform for wave generation
      heightmapVariable.material.uniforms['time'].value = timeRef.current;

      frame++;
      // Compute less frequently for slower, smoother simulation
      if (frame >= 3) {
        gpuCompute.compute();
        const tmpHeightmap = gpuCompute.getCurrentRenderTarget(heightmapVariable).texture;

        if (waterMesh && waterMesh.material.userData.shader) {
          waterMesh.material.userData.shader.uniforms.heightmap.value = tmpHeightmap;
        }

        frame = 0;
      }

      renderer.render(scene, camera);
    }

    init();

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', () => {});
    };
  }, []);

  const toggleSimulation = () => {
    if (!isRunning) {
      // Starting - reset time to send a fresh wave
      if (resetTimeRef.current) {
        resetTimeRef.current();
      }
      setIsRunning(true);
    } else {
      // Stopping
      setIsRunning(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Info Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '15px 20px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '13px',
        lineHeight: '1.6',
        pointerEvents: 'none'
      }}>
        <div><strong>Shallow Water Wave Breaking - GPGPU</strong></div>
        <div style={{ marginTop: '10px', fontSize: '11px' }}>
          Realistic wave shoaling and breaking with white water foam
        </div>
        <div style={{ fontSize: '11px', opacity: 0.7 }}>
          Based on shallow water equations • Click to send wave
        </div>
      </div>

      {/* Control Button */}
      <button
        onClick={toggleSimulation}
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '15px 40px',
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          color: '#fff',
          background: isRunning
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #0077be 0%, #00a8e8 100%)',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          pointerEvents: 'auto',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        }}
      >
        {isRunning ? '⏸ Pause Wave' : '🌊 Send Wave'}
      </button>
    </div>
  );
}
