# Advanced Ocean Simulator - MLS-MPM + FFT Hybrid Implementation

## Vision: Demo-Level Realism
Target the smooth, dynamic surface motion seen in cutting-edge WebGPU fluid demos with:
- 100k-300k particles (MLS-MPM)
- FFT wave base layer (JONSWAP spectrum)
- Meshless rendering (SSFR)
- Real-time interactivity
- 60 FPS on modern hardware

## Core Technologies

### 1. Hybrid Physics System
**FFT Base Layer (JONSWAP Spectrum)**
- Provides large-scale wave propagation
- Wind-driven height field
- Efficient for distant ocean

**MLS-MPM Particle Overlay**
- Handles breaking, curling, undertow
- Interactive disturbances
- Fine-detail surface motion
- 100k-300k active particles

**P2G/G2P Transfers**
```wgsl
// Particle-to-Grid (scatter)
@compute @workgroup_size(256)
fn p2g(@builtin(global_invocation_id) id: vec3<u32>) {
    let pid = id.x;
    if (pid >= particleCount) { return; }

    let p = particles[pid];
    let base = vec2<i32>(floor(p.position.xz / dx));

    // Quadratic kernel weights
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            let cell = base + vec2<i32>(i - 1, j - 1);
            let weight = quadraticWeight(p.position.xz, cell);

            // Atomic scatter (parallel safe)
            atomicAdd(&grid[cellIdx].mass, u32(weight * p.mass * 1000000.0));
            atomicAdd(&grid[cellIdx].momentum.x, i32(weight * p.mass * p.velocity.x * 1000000.0));
            atomicAdd(&grid[cellIdx].momentum.y, i32(weight * p.mass * p.velocity.z * 1000000.0));
        }
    }
}

// Grid-to-Particle (gather)
@compute @workgroup_size(256)
fn g2p(@builtin(global_invocation_id) id: vec3<u32>) {
    let pid = id.x;
    let base = vec2<i32>(floor(particles[pid].position.xz / dx));

    var new_vel = vec3<f32>(0.0);
    var affine = mat2x2<f32>(0.0);

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            let cell = base + vec2<i32>(i - 1, j - 1);
            let weight = quadraticWeight(particles[pid].position.xz, cell);
            let g = grid[cellIdx];

            let vel = g.momentum / g.mass;
            new_vel += weight * vel;

            // APIC transfer
            let dist = (vec2<f32>(cell) * dx) - particles[pid].position.xz;
            affine += weight * outerProduct(vel.xz, dist);
        }
    }

    particles[pid].velocity = new_vel;
    particles[pid].affine = affine;
}
```

### 2. Screen-Space Fluid Rendering (SSFR)

**Pass 1: Depth Map**
```wgsl
// Render particles as point sprites, output depth
@fragment
fn depth_fs(input: VertexOutput) -> @location(0) f32 {
    let r = length(input.texCoord - 0.5);
    if (r > 0.5) { discard; }

    // Spherical depth offset
    let z_offset = sqrt(1.0 - r * r) * particleRadius;
    return input.depth + z_offset;
}
```

**Pass 2: Bilateral Blur (Smooth Surface)**
```wgsl
@compute @workgroup_size(16, 16)
fn bilateral_blur(@builtin(global_invocation_id) id: vec3<u32>) {
    let uv = vec2<f32>(id.xy) / vec2<f32>(resolution);
    let center_depth = textureSample(depthTex, samp, uv).r;

    var sum = 0.0;
    var weight_sum = 0.0;

    // Gaussian + depth-aware weights
    for (var y = -kernelSize; y <= kernelSize; y++) {
        for (var x = -kernelSize; x <= kernelSize; x++) {
            let offset = vec2<f32>(f32(x), f32(y)) / vec2<f32>(resolution);
            let sample_depth = textureSample(depthTex, samp, uv + offset).r;

            let spatial_weight = exp(-f32(x*x + y*y) / (2.0 * sigma_spatial * sigma_spatial));
            let depth_weight = exp(-abs(sample_depth - center_depth) / sigma_depth);

            let w = spatial_weight * depth_weight;
            sum += sample_depth * w;
            weight_sum += w;
        }
    }

    textureStore(smoothDepthTex, id.xy, vec4<f32>(sum / weight_sum));
}
```

**Pass 3: Normal Calculation**
```wgsl
@compute @workgroup_size(16, 16)
fn compute_normals(@builtin(global_invocation_id) id: vec3<u32>) {
    let uv = vec2<f32>(id.xy) / vec2<f32>(resolution);

    // Screen-space derivatives
    let ddx = textureSample(smoothDepthTex, samp, uv + vec2<f32>(1.0/resolution.x, 0.0)).r
            - textureSample(smoothDepthTex, samp, uv - vec2<f32>(1.0/resolution.x, 0.0)).r;
    let ddy = textureSample(smoothDepthTex, samp, uv + vec2<f32>(0.0, 1.0/resolution.y)).r
            - textureSample(smoothDepthTex, samp, uv - vec2<f32>(0.0, 1.0/resolution.y)).r;

    let normal = normalize(vec3<f32>(-ddx, 1.0, -ddy));
    textureStore(normalTex, id.xy, vec4<f32>(normal, 1.0));
}
```

**Pass 4: PBR Shading**
```wgsl
@fragment
fn pbr_fs(input: VertexOutput) -> @location(0) vec4<f32> {
    let depth = textureSample(smoothDepthTex, samp, input.uv).r;
    let normal = textureSample(normalTex, samp, input.uv).xyz;
    let thickness = textureSample(thicknessTex, samp, input.uv).r;

    // Reconstruct world position
    let worldPos = depthToWorld(depth, input.uv);

    // Fresnel
    let viewDir = normalize(cameraPos - worldPos);
    let fresnel = schlickFresnel(dot(viewDir, normal), 0.02);

    // Reflection
    let reflectDir = reflect(-viewDir, normal);
    let reflection = textureSample(envMap, samp, reflectDir).rgb;

    // Refraction
    let refractDir = refract(-viewDir, normal, 1.0 / 1.33);
    let refraction = textureSample(sceneTex, samp, input.uv + refractDir.xy * 0.1).rgb;

    // Subsurface scattering (thickness-based)
    let sss = exp(-thickness * vec3<f32>(0.8, 1.0, 1.2)) * vec3<f32>(0.0, 0.4, 0.5);

    // Combine
    var color = mix(refraction, reflection, fresnel);
    color += sss * 0.3;

    return vec4<f32>(color, 1.0);
}
```

### 3. MLS-MPM Implementation Details

**Material Point Configuration**
```javascript
const MPMConfig = {
    // Grid
    gridResolution: [128, 64, 128],  // X, Y, Z
    dx: 0.25,                         // Grid cell size (meters)

    // Particles
    particleCount: 200000,
    particlesPerCell: 4,              // Initial density
    particleRadius: 0.1,

    // Physics
    dt: 0.008,                        // 2 substeps per 60fps frame
    gravity: [0, -9.81, 0],

    // Material (water)
    E: 1e4,                           // Young's modulus (flexible)
    nu: 0.2,                          // Poisson's ratio
    density: 1000,                    // kg/m³

    // Vorticity confinement
    vorticityStrength: 0.02,

    // Breaking detection
    curlThreshold: 2.5,               // rad/s - spawn foam
    velocityThreshold: 3.0,           // m/s - breaking wave
};
```

**Vorticity Confinement (Swirling Foam)**
```wgsl
@compute @workgroup_size(8, 8, 8)
fn compute_vorticity(@builtin(global_invocation_id) id: vec3<u32>) {
    let cell = id.xyz;

    // Compute curl
    let v_right = grid[cellIdx(cell + vec3<u32>(1, 0, 0))].velocity;
    let v_left = grid[cellIdx(cell - vec3<u32>(1, 0, 0))].velocity;
    let v_up = grid[cellIdx(cell + vec3<u32>(0, 1, 0))].velocity;
    let v_down = grid[cellIdx(cell - vec3<u32>(0, 1, 0))].velocity;
    let v_front = grid[cellIdx(cell + vec3<u32>(0, 0, 1))].velocity;
    let v_back = grid[cellIdx(cell - vec3<u32>(0, 0, 1))].velocity;

    let curl = vec3<f32>(
        (v_front.y - v_back.y) - (v_up.z - v_down.z),
        (v_up.x - v_down.x) - (v_right.z - v_left.z),
        (v_right.y - v_left.y) - (v_front.x - v_back.x)
    ) / (2.0 * dx);

    // Vorticity confinement force
    let curl_mag = length(curl);
    if (curl_mag > 0.001) {
        let N = normalize(curl);
        let force = vorticityStrength * dx * N * curl_mag;
        grid[cellIdx(cell)].velocity += force * dt;
    }

    // Spawn foam particles at high curl
    if (curl_mag > curlThreshold) {
        spawnFoamParticle(cell);
    }
}
```

### 4. FFT Integration (Choppy Waves)

**Horizontal Displacement**
```wgsl
// In FFT compute shader, after height field H(k,t)
@compute @workgroup_size(16, 16)
fn compute_displacement(@builtin(global_invocation_id) id: vec3<u32>) {
    let k = wavevector(id.xy);
    let h = heightField[id.x * N + id.y];

    // Choppy displacement: D(x,t) = -i * k / |k| * h(k,t)
    let k_mag = length(k);
    if (k_mag > 0.001) {
        let choppiness = 2.0;  // User-adjustable
        displacementField[id.x * N + id.y] = vec2<f32>(
            -k.x / k_mag * h.imag() * choppiness,
            -k.y / k_mag * h.imag() * choppiness
        );
    }
}
```

### 5. Interactivity

**Mouse/Touch Disturbance**
```javascript
// Raycast to ocean surface
function onPointerMove(event) {
    const ndc = screenToNDC(event.clientX, event.clientY);
    const ray = ndcToRay(ndc, camera);

    const intersect = rayPlaneIntersect(ray, oceanPlane);
    if (intersect) {
        // Inject velocity into particle system
        const radius = 2.0;
        const strength = 50.0;

        injectVelocityToParticles({
            position: intersect,
            radius: radius,
            velocity: [0, strength, 0],
            falloff: 'gaussian'
        });
    }
}
```

## Implementation Roadmap

### Milestone 1: WebGPU + Basic Particles (Week 1)
- [x] WebGPU context initialization
- [ ] Simple particle buffer (10k particles)
- [ ] Basic P2G/G2P transfers
- [ ] Point sprite rendering
- **Goal:** See moving particles in a box

### Milestone 2: MLS-MPM Physics (Week 2)
- [ ] Full 200k particle system
- [ ] Vorticity confinement
- [ ] Collision with beach plane
- [ ] Particle lifecycle (spawn/die)
- **Goal:** Fluid-like motion, breaking waves

### Milestone 3: SSFR Rendering (Week 3)
- [ ] Depth map generation
- [ ] Bilateral blur smoothing
- [ ] Normal calculation
- [ ] PBR shading
- **Goal:** Smooth, glossy water surface

### Milestone 4: FFT Hybrid (Week 4)
- [ ] JONSWAP spectrum
- [ ] Time-dependent wave field
- [ ] Choppy displacement
- [ ] Particle seeding from FFT crests
- **Goal:** Large-scale waves + fine detail

### Milestone 5: Polish (Week 5)
- [ ] Caustics (ray-marched)
- [ ] Subsurface scattering
- [ ] Bloom + god rays
- [ ] LOD system
- [ ] Interactive controls
- **Goal:** Demo-level visual quality

## Performance Targets

### GPU Requirements
- **Minimum:** Integrated GPU (Intel Iris Xe, Apple M1)
  - 100k particles @ 60 FPS
  - Medium LOD

- **Recommended:** Discrete GPU (RTX 3060, RX 6600)
  - 300k particles @ 90 FPS
  - High LOD + all effects

### Optimization Strategy
- **LOD:**
  - Near (0-20m): Full particle sim + SSFR
  - Mid (20-50m): Half-res particles
  - Far (50m+): FFT only, no particles

- **Async Compute:**
  - Physics update on compute queue
  - Rendering on graphics queue
  - Overlap for 30% speedup

- **Fixed-Point Math:**
  - Convert to `u32` for atomic operations
  - Scale factor: 1,000,000 for 6 decimal precision
  - Prevents float precision issues in P2G

## Code Structure
```
ocean-wave-simulator/
├── OceanWaveSimulatorAdvanced.jsx
├── core/
│   ├── WebGPUContext.js
│   ├── ResourceManager.js
│   └── PerformanceMonitor.js
├── physics/
│   ├── MLSMPMSolver.js
│   ├── FFTOcean.js
│   └── ParticleSystem.js
├── rendering/
│   ├── SSFRRenderer.js
│   ├── PBRShader.js
│   └── PostProcessor.js
├── shaders/
│   ├── mpm/
│   │   ├── p2g.wgsl
│   │   ├── g2p.wgsl
│   │   ├── vorticity.wgsl
│   │   └── collision.wgsl
│   ├── ssfr/
│   │   ├── depth.wgsl
│   │   ├── blur.wgsl
│   │   ├── normals.wgsl
│   │   └── shading.wgsl
│   └── fft/
│       ├── jonswap.wgsl
│       ├── time-evolve.wgsl
│       └── ifft.wgsl
└── utils/
    ├── MathHelpers.js
    └── ShaderLoader.js
```

## Testing Strategy
1. **Unit Tests:** Each compute shader individually
2. **Integration Tests:** P2G → G2P → Render pipeline
3. **Performance Tests:** Frame time budgets
4. **Visual Tests:** Compare to reference demos

## References
- [Hu et al. - MLS-MPM](https://yuanming.taichi.graphics/publication/2018-mlsmpm/mls-mpm.pdf)
- [Tessendorf - Simulating Ocean Water](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.161.9102)
- [van der Laan - SSFR](https://developer.download.nvidia.com/presentations/2010/gdc/Direct3D_Effects.pdf)
- [Bridson - Fluid Simulation](https://www.cs.ubc.ca/~rbridson/fluidsimulation/)

## Next Steps
Ready to start **Milestone 1**: WebGPU context + basic particle system?
