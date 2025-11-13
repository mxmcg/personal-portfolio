# Showcase Apps

This directory contains modular, self-contained UI showcase applications for the portfolio's `/showcase` route.

## Architecture

Each showcase app follows these principles:

### Directory Structure

```
showcase-apps/
├── [app-name]/
│   ├── index.js              # Export component and metadata
│   ├── [Component].jsx       # Main component file
│   ├── README.md            # App-specific documentation
│   └── [additional files]   # Supporting files if needed
```

### Best Practices

1. **Self-Contained**: Each app should be completely independent and modular
2. **Metadata Export**: Export metadata from `index.js` for registry integration
3. **Client-Side Safe**: Use `'use client'` directive for client-only code
4. **Documentation**: Include a README explaining the app and its features
5. **Clean Exports**: Export the component as default from index.js

### Creating a New Showcase App

1. **Create Directory**
   ```bash
   mkdir app/showcase-apps/[app-name]
   ```

2. **Create Component**
   Create your component file (`.jsx` or `.tsx`)

3. **Create Index File**
   ```javascript
   // index.js
   import YourComponent from './YourComponent.jsx';

   export default YourComponent;

   export const metadata = {
     slug: 'your-app-slug',
     title: 'Your App Title',
     description: 'Brief description of your app',
     tags: ['Tag1', 'Tag2', 'Tag3'],
   };
   ```

4. **Update Registry**
   Add to `app/lib/showcases.tsx`:
   ```typescript
   import YourApp from "../showcase-apps/[app-name]";

   // In the showcases array:
   {
     slug: "your-app-slug",
     title: "Your App Title",
     description: "Description",
     tags: ["Tag1", "Tag2"],
     component: <YourApp />,
   }
   ```

5. **Add README**
   Document your app's features, dependencies, and usage

## Current Apps

### Ocean Wave Simulator
- **Path**: `ocean-wave-simulator/`
- **Tech**: Three.js, WebGL, GLSL
- **Features**: Procedural ocean waves, dynamic lighting, weather modes

## Guidelines

- Keep apps focused on demonstrating specific UI/UX concepts
- Minimize external dependencies where possible
- Ensure apps are responsive and accessible
- Include interactive elements when appropriate
- Document any special requirements or dependencies
