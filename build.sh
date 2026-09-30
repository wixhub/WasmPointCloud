#!/bin/bash

# Exit immediately if any command exits with a non-zero status
set -e

echo "--------------------------------------------------"
echo "Compiling C++20 Point Cloud Engine to WebAssembly..."
echo "--------------------------------------------------"

# Ensure the output directory exists in the Angular public folder
mkdir -p frontend/public/wasm

# Run the Emscripten compiler with corrected backend paths
em++ backend/src/PointCloudEngine.cpp backend/bindings.cpp \
  -o frontend/public/wasm/pointCloudModule.js \
  -std=c++20 \
  -O3 \
  -Ibackend/include \
  --bind \
  -s WASM=1 \
  -s EXPORT_ES6=0 \
  -s MODULARIZE=1 \
  -s "EXPORT_NAME='createPointCloudModule'" \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'

echo "--------------------------------------------------"
echo "Success! WASM module generated in frontend/public/wasm/"
echo "--------------------------------------------------"