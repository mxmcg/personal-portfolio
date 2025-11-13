'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function OceanWaveSimulator() {
  const mountRef = useRef(null);
  const uniformsRef = useRef(null);
  const beachRef = useRef(null);
  const [waveType, setWaveType] = useState('calm');

  useEffect(() => {
    if (!mountRef.current) return;

    // Wave preset configurations
    const wavePresets = {
      calm: {
        waves: [
          { direction: [0.1, 1.0], amplitude: 0.25, wavelength: 12.0, speed: 0.4, steepness: 0.3 },
          { direction: [-0.2, 1.0], amplitude: 0.15, wavelength: 8.0, speed: 0.5, steepness: 0.35 },
          { direction: [0.15, 0.98], amplitude: 0.1, wavelength: 6.0, speed: 0.35, steepness: 0.25 },
          { direction: [-0.1, 1.0], amplitude: 0.12, wavelength: 10.0, speed: 0.3, steepness: 0.3 }
        ]
      },
      stormy: {
        waves: [
          { direction: [0.0, 1.0], amplitude: 0.8, wavelength: 16.0, speed: 1.3, steepness: 0.7 },
          { direction: [0.3, 1.0], amplitude: 0.6, wavelength: 11.0, speed: 1.6, steepness: 0.65 },
          { direction: [-0.25, 1.0], amplitude: 0.45, wavelength: 8.5, speed: 1.4, steepness: 0.6 },
          { direction: [0.15, 0.95], amplitude: 0.5, wavelength: 13.0, speed: 1.5, steepness: 0.65 }
        ]
      },
      pointBreak: {
        waves: [
          { direction: [0.6, 1.0], amplitude: 0.6, wavelength: 15.0, speed: 1.0, steepness: 0.55 },
          { direction: [0.65, 1.0], amplitude: 0.3, wavelength: 9.0, speed: 1.4, steepness: 0.5 },
          { direction: [0.55, 0.95], amplitude: 0.18, wavelength: 6.5, speed: 0.9, steepness: 0.45 },
          { direction: [0.6, 1.0], amplitude: 0.25, wavelength: 11.0, speed: 1.2, steepness: 0.5 }
        ]
      },
      beachBreak: {
        waves: [
          { direction: [0.2, 1.0], amplitude: 0.4, wavelength: 9.5, speed: 1.3, steepness: 0.5 },
          { direction: [-0.3, 1.0], amplitude: 0.35, wavelength: 7.5, speed: 1.5, steepness: 0.55 },
          { direction: [0.4, 0.95], amplitude: 0.28, wavelength: 6.5, speed: 1.7, steepness: 0.5 },
          { direction: [-0.15, 1.0], amplitude: 0.32, wavelength: 8.5, speed: 1.4, steepness: 0.52 }
        ]
      }
    };

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    // Zoomed out view - higher and further back
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 0, -30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Realistic sky gradient
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#1e3a5f');
    gradient.addColorStop(0.3, '#4a7ba7');
    gradient.addColorStop(0.6, '#87CEEB');
    gradient.addColorStop(0.85, '#bfd9e8');
    gradient.addColorStop(1, '#d4e5f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2, 512);

    const skyTexture = new THREE.CanvasTexture(canvas);
    scene.background = skyTexture;

    // Enhanced lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(50, 40, 30);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x4a7ba7, 0.6);
    scene.add(ambientLight);

    // Create realistic beach/sand in foreground
    const beachGeometry = new THREE.PlaneGeometry(100, 40, 128, 64);
    beachGeometry.rotateX(-Math.PI / 2);

    // Add gentle slope to beach
    const positions = beachGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const z = positions.getZ(i);
      // Slope down toward water
      const slopeHeight = Math.max(0, (z / 20) * 0.8);
      positions.setY(i, slopeHeight);
    }
    beachGeometry.computeVertexNormals();

    // Realistic sand shader
    const beachUniforms = {
      uTime: { value: 0 },
      uSunPosition: { value: new THREE.Vector3(50, 40, 30) },
    };

    const beachVertexShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        vPosition = position;
        vNormal = normal;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const beachFragmentShader = `
      uniform vec3 uSunPosition;
      uniform float uTime;

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      // Noise functions for sand texture
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
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uSunPosition);

        // Realistic sand colors
        vec3 sandBase = vec3(0.76, 0.70, 0.50);        // Warm sand
        vec3 sandDark = vec3(0.65, 0.58, 0.40);        // Darker sand
        vec3 sandWet = vec3(0.55, 0.50, 0.38);         // Wet sand near water

        // Add texture variation with noise
        float sandNoise = noise(vPosition.xz * 8.0);
        float sandNoise2 = noise(vPosition.xz * 20.0);
        vec3 sandColor = mix(sandDark, sandBase, sandNoise);
        sandColor = mix(sandColor, sandBase * 1.1, sandNoise2 * 0.3);

        // Wet sand near water (lower Z values)
        float wetness = smoothstep(5.0, -2.0, vPosition.z);
        sandColor = mix(sandColor, sandWet, wetness * 0.7);

        // Lighting
        float diffuse = max(dot(normal, lightDir), 0.0);
        float ambient = 0.5;

        vec3 finalColor = sandColor * (ambient + diffuse * 0.5);

        // Add slight specular for wet sand
        vec3 viewDir = normalize(cameraPosition - vPosition);
        vec3 halfVector = normalize(lightDir + viewDir);
        float specular = pow(max(dot(normal, halfVector), 0.0), 32.0);
        finalColor += vec3(1.0, 0.95, 0.8) * specular * wetness * 0.15;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const beachMaterial = new THREE.ShaderMaterial({
      uniforms: beachUniforms,
      vertexShader: beachVertexShader,
      fragmentShader: beachFragmentShader,
      side: THREE.DoubleSide
    });

    const beachMesh = new THREE.Mesh(beachGeometry, beachMaterial);
    beachMesh.position.set(0, 0, 12);
    beachMesh.visible = false; // Hidden by default
    scene.add(beachMesh);
    beachRef.current = beachMesh;

    // Ocean shader uniforms
    const uniforms = {
      uTime: { value: 0 },
      uSunPosition: { value: new THREE.Vector3(50, 40, 30) },
      uSunColor: { value: new THREE.Color(1.0, 0.95, 0.85) },
      uCameraPosition: { value: camera.position },
      uShoreDistance: { value: 18.0 },
      uWave1Dir: { value: new THREE.Vector2(0.1, 1.0) },
      uWave1Amp: { value: 0.25 },
      uWave1Wavelength: { value: 12.0 },
      uWave1Speed: { value: 0.4 },
      uWave1Steepness: { value: 0.3 },
      uWave2Dir: { value: new THREE.Vector2(-0.2, 1.0) },
      uWave2Amp: { value: 0.15 },
      uWave2Wavelength: { value: 8.0 },
      uWave2Speed: { value: 0.5 },
      uWave2Steepness: { value: 0.35 },
      uWave3Dir: { value: new THREE.Vector2(0.15, 0.98) },
      uWave3Amp: { value: 0.1 },
      uWave3Wavelength: { value: 6.0 },
      uWave3Speed: { value: 0.35 },
      uWave3Steepness: { value: 0.25 },
      uWave4Dir: { value: new THREE.Vector2(-0.1, 1.0) },
      uWave4Amp: { value: 0.12 },
      uWave4Wavelength: { value: 10.0 },
      uWave4Speed: { value: 0.3 },
      uWave4Steepness: { value: 0.3 }
    };

    uniformsRef.current = { uniforms, presets: wavePresets, beachUniforms };

    // Professional-grade vertex shader
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uWave1Dir, uWave2Dir, uWave3Dir, uWave4Dir;
      uniform float uWave1Amp, uWave2Amp, uWave3Amp, uWave4Amp;
      uniform float uWave1Wavelength, uWave2Wavelength, uWave3Wavelength, uWave4Wavelength;
      uniform float uWave1Speed, uWave2Speed, uWave3Speed, uWave4Speed;
      uniform float uWave1Steepness, uWave2Steepness, uWave3Steepness, uWave4Steepness;
      uniform vec3 uCameraPosition;

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying float vElevation;
      varying float vDistanceToShore;
      varying vec2 vUv;

      vec3 gerstnerWave(vec2 pos, float wavelength, float amplitude, float speed, float steepness, vec2 direction, float time, out vec3 tangent, out vec3 binormal) {
        vec2 d = normalize(direction);
        float k = 2.0 * 3.14159265 / wavelength;
        float c = sqrt(9.8 / k);
        float f = k * (dot(d, pos) - c * speed * time);
        float a = steepness * amplitude;

        vec3 wave = vec3(
          d.x * a * cos(f),
          a * sin(f),
          d.y * a * cos(f)
        );

        tangent = vec3(
          1.0 - d.x * d.x * steepness * sin(f),
          d.x * steepness * cos(f),
          -d.x * d.y * steepness * sin(f)
        );

        binormal = vec3(
          -d.x * d.y * steepness * sin(f),
          d.y * steepness * cos(f),
          1.0 - d.y * d.y * steepness * sin(f)
        );

        return wave;
      }

      void main() {
        vUv = uv;
        vec2 pos2d = position.xz;

        float distanceToShore = length(position.xz - uCameraPosition.xz);
        vDistanceToShore = distanceToShore;
        float shoreProximity = smoothstep(80.0, 8.0, distanceToShore);

        vec3 gridPoint = position;
        vec3 tangent = vec3(1.0, 0.0, 0.0);
        vec3 binormal = vec3(0.0, 0.0, 1.0);
        vec3 t, b;

        float amp1 = uWave1Amp * (1.0 + shoreProximity * 1.5);
        vec3 wave1 = gerstnerWave(pos2d, uWave1Wavelength, amp1, uWave1Speed, uWave1Steepness, uWave1Dir, uTime, t, b);
        gridPoint += wave1;
        tangent += t;
        binormal += b;

        float amp2 = uWave2Amp * (1.0 + shoreProximity * 1.5);
        vec3 wave2 = gerstnerWave(pos2d, uWave2Wavelength, amp2, uWave2Speed, uWave2Steepness, uWave2Dir, uTime, t, b);
        gridPoint += wave2;
        tangent += t;
        binormal += b;

        float amp3 = uWave3Amp * (1.0 + shoreProximity * 1.5);
        vec3 wave3 = gerstnerWave(pos2d, uWave3Wavelength, amp3, uWave3Speed, uWave3Steepness, uWave3Dir, uTime, t, b);
        gridPoint += wave3;
        tangent += t;
        binormal += b;

        float amp4 = uWave4Amp * (1.0 + shoreProximity * 1.5);
        vec3 wave4 = gerstnerWave(pos2d, uWave4Wavelength, amp4, uWave4Speed, uWave4Steepness, uWave4Dir, uTime, t, b);
        gridPoint += wave4;
        tangent += t;
        binormal += b;

        vec3 normal = normalize(cross(binormal, tangent));

        vPosition = gridPoint;
        vWorldPosition = (modelMatrix * vec4(gridPoint, 1.0)).xyz;
        vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        vElevation = gridPoint.y;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(gridPoint, 1.0);
      }
    `;

    // Professional-grade fragment shader
    const fragmentShader = `
      uniform vec3 uSunPosition;
      uniform vec3 uSunColor;
      uniform vec3 uCameraPosition;
      uniform float uTime;

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying float vElevation;
      varying float vDistanceToShore;
      varying vec2 vUv;

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

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      float fresnelSchlick(float cosTheta, float F0) {
        return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
        vec3 lightDir = normalize(uSunPosition);

        float distanceToCamera = length(vWorldPosition - uCameraPosition);
        float shoreProximity = smoothstep(80.0, 5.0, vDistanceToShore);

        // Physically-based ocean colors
        vec3 deepOceanColor = vec3(0.0, 0.05, 0.15);
        vec3 oceanColor = vec3(0.0, 0.15, 0.35);
        vec3 shallowColor = vec3(0.0, 0.4, 0.5);
        vec3 shoreColor = vec3(0.1, 0.6, 0.65);

        vec3 waterColor = mix(deepOceanColor, oceanColor, smoothstep(100.0, 50.0, distanceToCamera));
        waterColor = mix(waterColor, shallowColor, smoothstep(50.0, 20.0, vDistanceToShore));
        waterColor = mix(waterColor, shoreColor, shoreProximity * 0.8);

        float fresnel = fresnelSchlick(max(dot(viewDir, normal), 0.0), 0.02);
        vec3 skyColor = mix(vec3(0.5, 0.7, 0.9), vec3(0.8, 0.9, 1.0), fresnel);

        float diffuse = max(dot(normal, lightDir), 0.0);

        vec3 halfVector = normalize(lightDir + viewDir);
        float specular = pow(max(dot(normal, halfVector), 0.0), 256.0);
        float specularStrength = smoothstep(0.0, 0.01, specular);

        float backlight = max(0.0, dot(viewDir, -lightDir));
        float subsurface = pow(backlight, 3.0) * 0.5;
        vec3 subsurfaceColor = vec3(0.0, 0.4, 0.5) * subsurface;

        float fogFactor = smoothstep(30.0, 100.0, distanceToCamera);
        vec3 fogColor = vec3(0.8, 0.9, 0.95);

        float foamNoise = fbm(vWorldPosition.xz * 2.0 + uTime * 0.5);
        float foamNoise2 = fbm(vWorldPosition.xz * 4.0 - uTime * 0.3);

        float crestFoam = smoothstep(0.2, 0.5, vElevation) * (0.2 + shoreProximity * 0.8);
        crestFoam *= foamNoise;

        float breakingFoam = smoothstep(0.6, 1.2, abs(vElevation)) * shoreProximity * 0.8;
        breakingFoam *= foamNoise2;

        float shoreFoam = smoothstep(12.0, 5.0, vDistanceToShore) * 0.95;
        shoreFoam *= mix(foamNoise, foamNoise2, 0.5);

        float totalFoam = max(crestFoam, max(breakingFoam, shoreFoam));
        totalFoam = smoothstep(0.3, 0.8, totalFoam);

        vec3 foamColor = vec3(0.95, 0.98, 1.0);

        vec3 finalColor = waterColor;
        finalColor *= (0.4 + diffuse * 0.6);
        finalColor = mix(finalColor, skyColor, fresnel * 0.85);
        finalColor += subsurfaceColor * (1.0 - totalFoam);
        finalColor += uSunColor * specularStrength * 2.0;
        finalColor = mix(finalColor, foamColor, totalFoam);
        finalColor = mix(finalColor, fogColor, fogFactor * 0.7);
        finalColor = pow(finalColor, vec3(0.9));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create ocean mesh
    const geometry = new THREE.PlaneGeometry(180, 180, 512, 512);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, 0, -30);

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide
    });

    const ocean = new THREE.Mesh(geometry, material);
    scene.add(ocean);

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;
      beachUniforms.uTime.value = elapsedTime;

      // Subtle camera movement
      camera.position.x = mouse.x * 0.8;
      camera.position.y = 4 + mouse.y * 0.4;
      camera.lookAt(0, 0, -30);

      uniforms.uCameraPosition.value.copy(camera.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      beachGeometry.dispose();
      material.dispose();
      beachMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  // Wave parameter interpolation and beach visibility
  useEffect(() => {
    if (!uniformsRef.current || !beachRef.current) return;

    const { uniforms, presets } = uniformsRef.current;
    const preset = presets[waveType];
    if (!preset) return;

    // Show beach for point break and beach break
    const showBeach = waveType === 'pointBreak' || waveType === 'beachBreak';
    beachRef.current.visible = showBeach;

    const interpolate = (uniform, targetValue, duration = 1500) => {
      const startValue = uniform.value instanceof THREE.Vector2
        ? uniform.value.clone()
        : uniform.value;
      const startTime = Date.now();

      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

        if (startValue instanceof THREE.Vector2) {
          uniform.value.x = startValue.x + (targetValue.x - startValue.x) * eased;
          uniform.value.y = startValue.y + (targetValue.y - startValue.y) * eased;
        } else {
          uniform.value = startValue + (targetValue - startValue) * eased;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      update();
    };

    preset.waves.forEach((wave, i) => {
      const num = i + 1;
      interpolate(uniforms[`uWave${num}Dir`], new THREE.Vector2(wave.direction[0], wave.direction[1]));
      interpolate(uniforms[`uWave${num}Amp`], wave.amplitude);
      interpolate(uniforms[`uWave${num}Wavelength`], wave.wavelength);
      interpolate(uniforms[`uWave${num}Speed`], wave.speed);
      interpolate(uniforms[`uWave${num}Steepness`], wave.steepness);
    });
  }, [waveType]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', background: '#1e3a5f' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setWaveType('calm')}
            style={{
              padding: '12px 24px',
              backgroundColor: waveType === 'calm' ? '#5eead4' : 'rgba(255, 255, 255, 0.95)',
              color: waveType === 'calm' ? '#0f172a' : '#475569',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Calm
          </button>
          <button
            onClick={() => setWaveType('stormy')}
            style={{
              padding: '12px 24px',
              backgroundColor: waveType === 'stormy' ? '#5eead4' : 'rgba(255, 255, 255, 0.95)',
              color: waveType === 'stormy' ? '#0f172a' : '#475569',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Stormy
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setWaveType('pointBreak')}
            style={{
              padding: '12px 24px',
              backgroundColor: waveType === 'pointBreak' ? '#5eead4' : 'rgba(255, 255, 255, 0.95)',
              color: waveType === 'pointBreak' ? '#0f172a' : '#475569',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Point Break
          </button>
          <button
            onClick={() => setWaveType('beachBreak')}
            style={{
              padding: '12px 24px',
              backgroundColor: waveType === 'beachBreak' ? '#5eead4' : 'rgba(255, 255, 255, 0.95)',
              color: waveType === 'beachBreak' ? '#0f172a' : '#475569',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Beach Break
          </button>
        </div>
      </div>
    </div>
  );
}
