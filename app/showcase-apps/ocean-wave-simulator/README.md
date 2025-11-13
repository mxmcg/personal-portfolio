# Ocean Wave Simulator

A fully procedural WebGL ocean wave simulator built with Three.js and custom GLSL shaders. Features realistic shore-breaking behavior where swells travel from the distant horizon toward the beach and break naturally near the shore.

## Features

- **Realistic Shore-Breaking Physics**: Waves originate from the horizon and travel toward the camera (shore)
- **Depth-Based Wave Behavior**:
  - Waves increase in amplitude as they approach shallow water
  - Wave steepness increases near shore
  - Dramatic white water foam at the shore break
- **Dynamic Lighting**: Fresnel reflections, diffuse and specular lighting, depth-based coloring
- **Zoomed Out Perspective**: Wide-angle view capturing the full scope of the ocean scene
- **Realistic Beach Terrain** (Point Break & Beach Break modes only):
  - Procedurally generated sand with natural slope
  - Noise-based texture variation
  - Wet/dry sand gradients near waterline
  - Realistic sand colors (warm beige to dark wet sand)
  - Specular highlights on wet sand
- **Wave Profiles**: Four distinct wave types with smooth transitions
  - **Calm**: Gentle, slow-moving swells rolling in from the horizon (ocean view only)
  - **Stormy**: Large, powerful waves with dramatic shore breaks (ocean view only)
  - **Point Break**: Long, smooth peeling waves with beach in foreground
  - **Beach Break**: Multiple shorter waves breaking irregularly with beach in foreground
- **Smooth Transitions**: Wave parameters interpolate smoothly when switching profiles
- **Interactive Camera**: Subtle mouse parallax effect
- **100% Procedural**: No external textures or assets

## Technical Details

### Advanced Rendering Techniques

- **Proper Normal Calculation**: Computes tangent and binormal vectors from Gerstner wave derivatives for accurate lighting
- **Physically-Based Water Colors**: Simulates light absorption (red) and reflection (blue/green) based on real ocean optics
- **Schlick's Fresnel Approximation**: Accurate reflection at grazing angles
- **Subsurface Scattering**: Light penetrating through wave crests
- **Atmospheric Perspective**: Realistic fog/haze at the horizon
- **Noise-Based Foam**: Fractal Brownian Motion (FBM) creates natural foam patterns
- **High-Resolution Mesh**: 512x512 vertices for smooth wave motion
- **Multiple Lighting Layers**:
  - Diffuse lighting from sun
  - Specular highlights (sun glints on water)
  - Sky dome ambient light
  - Subsurface scattering

### Shaders

- **Vertex Shader**:
  - Gerstner wave displacement with steepness control
  - Shore-proximity amplitude scaling
  - Derivative-based normal calculation
- **Fragment Shader**:
  - Physically-based rendering (PBR)
  - 4-octave noise for foam patterns
  - Distance-based color transitions
  - Atmospheric fog
  - Tone mapping and gamma correction

### Performance

- Optimized pixel ratio (max 2x)
- Efficient shader compilation
- Proper WebGL resource cleanup
- Responsive to window resize

## Dependencies

- React
- Three.js

## Usage

```jsx
import OceanWaveSimulator from './OceanWaveSimulator.jsx';

<OceanWaveSimulator />
```
