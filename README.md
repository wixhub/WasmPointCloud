# 🛰️ WasmPointCloud Engine

A high-performance, browser-based spatial computing tool designed for the real-time processing and rendering of non-uniform point clouds and 3D geometric data.

## 🔬 Architectural Overview

- **C++20 Spatial Core**: Implements low-level data structures (such as spatial octrees and fast point-iterators) to handle dense spatial datasets natively.

- **WebAssembly Pipeline**: Compiles the heavy geometric processing routines via Emscripten/Ninja, allowing near-native execution speeds inside the browser sandbox.

- **Interactive Visual Analytics**: Integrates with a reactive TypeScript/Angular interface and WebGL/Three.js rendering pipeline to allow real-time point cloud manipulation, filtering, and multi-attribute color mapping.

_Developed as an exploration into client-side spatial data engines, aligning with research paradigms in interactive scientific visualization and 3D scene understanding._

## Project Folder Structure

```text
WasmPointCloud/
├── backend/
│   ├── include/
│   │   └── PointCloudEngine.hpp    # C++ data structures & spatial logic (Octree, filtering)
│   ├── src/
│   │   └── PointCloudEngine.cpp    # Implementation of spatial processing routines
│   └── bindings.cpp                # Emscripten EMSCRIPTEN_BINDINGS for JS interop
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/           # Angular UI components (controls, stats)
│   │   │   └── core/               # WASM loader & WebGL/Three.js rendering service
│   │   └── main.ts
│   └── package.json
├── CMakeLists.txt                  # Build configuration for CMake & Emscripten
└── build.sh                        # Automation script to compile C++ to WASM
```
