# Point Cloud Web

A high-performance web application featuring an interactive 3D point cloud renderer powered by **Angular**, **C++20 (WebAssembly / Emscripten)** and **Three.js**.

---

## Features

* **WASM-Powered Processing**: Heavy spatial point filtering (Voxel Grid downsampling) runs natively at near-hardware speeds inside the browser using WebAssembly.

* **Interactive 3D Rendering**: Built with Three.js to render thousands of points with custom spatial attributes and color mapping.

* **Dynamic Resolution Control**: Real-time slider and trigger controls to adjust voxel size and instantly filter dense point clouds.

* **Master Backup Architecture**: Maintains an immutable master dataset in C++, ensuring seamless switching between high-resolution and low-resolution budgets without data loss.

---

## Tech Stack

* **Frontend Framework**: Angular (Standalone Components, Signals). This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.6.

* **Core Engine**: C++20 compiled to WebAssembly (Emscripten)

* **Graphics & Rendering**: Three.js

* **Styling**: SCSS

---

## Getting Started

### Prerequisites

* Node.js & npm (for Angular)
* Emscripten SDK (`emcc`) (for compiling C++ to WebAssembly)

### Build & Run

1. **Compile the C++ WASM Module**:

```bash
./build.sh

```

2. **Install Dependencies**:

```bash
npm install

```

3. **Run the Development Server**:

```bash
ng serve

```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
