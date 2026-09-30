Context: We are developing a high-performance web application featuring an interactive 3D point cloud renderer powered by Angular (standalone components, signals), C++20 (WebAssembly via Emscripten) and Three.js. The backend maintains an immutable master backup (originalPoints) for non-destructive filtering, and the UI includes a live-updating voxel resolution slider paired with a status indicator badge.

Current State: The core WASM engine, reactive slider and UI sync are fully functional and stable.

Remaining Tasks to Implement:

1. Performance Latency Tracker: Measure and display the execution time (in milliseconds) of the C++/WASM voxel filtering operation to showcase WebAssembly speed.
2. Point Budget Switcher: Add a selector/dropdown to change the initial point count upon loading (e.g., 10,000, 100,000, or 1,000,000 points) for performance stress-testing.
3. Color Mapping Modes: Implement a feature in Three.js to switch point coloration (e.g., coloring by height/Z-axis gradient or by point intensity).
4. Export Filtered Data: Add an export button to download the currently filtered point cloud data into a file format (such as .xyz or .csv).

Let's start with the first task: implementing the Performance Latency Tracker.
