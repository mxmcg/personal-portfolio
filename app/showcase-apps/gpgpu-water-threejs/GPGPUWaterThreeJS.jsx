'use client';

import { useEffect, useRef } from 'react';

export default function GPGPUWaterThreeJS() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer, scene, camera, controls, stats;
    let waterMesh, poolBorder, meshRay;
    let gpuCompute, heightmapVariable;
    let animationId;

    const WIDTH = 128;
    const BOUNDS = 6;
    const BOUNDS_HALF = BOUNDS * 0.5;

    let mousedown = false;
    const mouseCoords = { x: 0, y: 0 };
    let frame = 0;

    const effectController = {
      mouseSize: 0.5,      // Increased from 0.2 - larger interaction radius
      mouseDeep: 0.05,     // Increased from 0.01 - deeper/stronger ripples
      viscosity: 0.93,
      speed: 5,
    };

    async function init() {
      // Dynamically import Three.js modules
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      const { GPUComputationRenderer } = await import('three/examples/jsm/misc/GPUComputationRenderer.js');
      const { SimplexNoise } = await import('three/examples/jsm/math/SimplexNoise.js');

      // Setup renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.5;
      containerRef.current.appendChild(renderer.domElement);

      // Setup scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87ceeb);

      // Setup camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 2.5, 4);
      camera.lookAt(0, 0, 0);

      // Setup controls
      controls = new OrbitControls(camera, renderer.domElement);

      // Add lighting
      const sun = new THREE.DirectionalLight(0xFFFFFF, 4.0);
      sun.position.set(-1, 2.6, 1.4);
      scene.add(sun);

      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);

      // Initialize water
      initWater(THREE, SimplexNoise, GPUComputationRenderer);

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
        render(THREE);
      }

      animate();
    }

    function initWater(THREE, SimplexNoise, GPUComputationRenderer) {
      // Water geometry
      const geometry = new THREE.PlaneGeometry(BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1);

      // Water material
      const material = new THREE.MeshStandardMaterial({
        color: 0x9bd2ec,
        metalness: 0.9,
        roughness: 0,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });

      waterMesh = new THREE.Mesh(geometry, material);
      waterMesh.rotation.x = -Math.PI * 0.5;
      waterMesh.matrixAutoUpdate = false;
      waterMesh.updateMatrix();
      scene.add(waterMesh);

      // Pool border
      const borderGeom = new THREE.TorusGeometry(4.2, 0.1, 12, 4);
      borderGeom.rotateX(Math.PI * 0.5);
      borderGeom.rotateY(Math.PI * 0.25);
      poolBorder = new THREE.Mesh(
        borderGeom,
        new THREE.MeshStandardMaterial({ color: 0x908877, roughness: 0.2 })
      );
      scene.add(poolBorder);

      // Ray mesh for mouse interaction
      const geometryRay = new THREE.PlaneGeometry(BOUNDS, BOUNDS, 1, 1);
      meshRay = new THREE.Mesh(
        geometryRay,
        new THREE.MeshBasicMaterial({ visible: false })
      );
      meshRay.rotation.x = -Math.PI / 2;
      meshRay.matrixAutoUpdate = false;
      meshRay.updateMatrix();
      scene.add(meshRay);

      // GPU Computation setup
      gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

      const heightmap0 = gpuCompute.createTexture();
      fillTexture(heightmap0, SimplexNoise);

      const heightmapFragmentShader = `
        #include <common>

        uniform vec2 mousePos;
        uniform float mouseSize;
        uniform float viscosity;
        uniform float deep;

        void main() {
          vec2 cellSize = 1.0 / resolution.xy;
          vec2 uv = gl_FragCoord.xy * cellSize;

          vec4 heightmapValue = texture2D(heightmap, uv);

          vec4 north = texture2D(heightmap, uv + vec2(0.0, cellSize.y));
          vec4 south = texture2D(heightmap, uv + vec2(0.0, -cellSize.y));
          vec4 east = texture2D(heightmap, uv + vec2(cellSize.x, 0.0));
          vec4 west = texture2D(heightmap, uv + vec2(-cellSize.x, 0.0));

          float newHeight = ((north.x + south.x + east.x + west.x) * 0.5 - heightmapValue.y) * viscosity;

          float mousePhase = clamp(length((uv - vec2(0.5)) * ${BOUNDS.toFixed(1)} - vec2(mousePos.x, -mousePos.y)) * PI / mouseSize, 0.0, PI);
          newHeight -= (cos(mousePhase) + 1.0) * deep;

          heightmapValue.y = heightmapValue.x;
          heightmapValue.x = newHeight;

          gl_FragColor = heightmapValue;
        }
      `;

      heightmapVariable = gpuCompute.addVariable('heightmap', heightmapFragmentShader, heightmap0);
      gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);

      heightmapVariable.material.uniforms['mousePos'] = { value: new THREE.Vector2(10000, 10000) };
      heightmapVariable.material.uniforms['mouseSize'] = { value: effectController.mouseSize };
      heightmapVariable.material.uniforms['viscosity'] = { value: effectController.viscosity };
      heightmapVariable.material.uniforms['deep'] = { value: effectController.mouseDeep };

      const error = gpuCompute.init();
      if (error !== null) {
        console.error('GPUComputationRenderer error:', error);
      }

      // Custom shader for water mesh
      material.onBeforeCompile = (shader) => {
        shader.uniforms.heightmap = { value: null };
        shader.uniforms.WIDTH = { value: WIDTH };
        shader.uniforms.BOUNDS = { value: BOUNDS };

        shader.vertexShader = `
          uniform sampler2D heightmap;
          uniform float WIDTH;
          uniform float BOUNDS;
          ${shader.vertexShader}
        `;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <beginnormal_vertex>',
          `
            vec2 cellSize = vec2(1.0 / WIDTH, 1.0 / WIDTH);
            vec3 objectNormal = vec3(
              (texture2D(heightmap, uv + vec2(-cellSize.x, 0)).x - texture2D(heightmap, uv + vec2(cellSize.x, 0)).x) * WIDTH / BOUNDS,
              (texture2D(heightmap, uv + vec2(0, -cellSize.y)).x - texture2D(heightmap, uv + vec2(0, cellSize.y)).x) * WIDTH / BOUNDS,
              1.0
            );
          `
        );

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
            float heightValue = texture2D(heightmap, uv).x;
            vec3 transformed = vec3(position.x, position.y, heightValue);
          `
        );

        waterMesh.material.userData.shader = shader;
      };
    }

    function fillTexture(texture, SimplexNoise) {
      const simplex = new SimplexNoise();
      const waterMaxHeight = 0.1;

      function noise(x, y) {
        let multR = waterMaxHeight;
        let mult = 0.025;
        let r = 0;
        for (let i = 0; i < 15; i++) {
          r += multR * simplex.noise(x * mult, y * mult);
          multR *= 0.53 + 0.025 * i;
          mult *= 1.25;
        }
        return r;
      }

      const pixels = texture.image.data;
      let p = 0;
      for (let j = 0; j < WIDTH; j++) {
        for (let i = 0; i < WIDTH; i++) {
          const x = i * 128 / WIDTH;
          const y = j * 128 / WIDTH;
          pixels[p + 0] = noise(x, y);
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

      frame++;
      if (frame >= 7 - effectController.speed) {
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
        <div><strong>Three.js WebGL GPGPU Water</strong></div>
        <div style={{ marginTop: '10px', fontSize: '11px' }}>
          Click and drag to disturb water
        </div>
      </div>
    </div>
  );
}
