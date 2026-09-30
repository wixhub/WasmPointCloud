cmake_minimum_required(VERSION 3.20)
project(WasmPointCloudEngine CXX)

# Require C++20
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Source files
set(SOURCES
    backend/src/PointCloudEngine.cpp
    backend/bindings.cpp
)

# Create an executable target (Emscripten uses executable targets to produce WASM outputs)
add_executable(PointCloudEngine ${SOURCES})

# Include directories
target_include_directories(PointCloudEngine PRIVATE cpp/include)

# Emscripten-specific linker flags for modern web integration
set(CMAKE_EXECUTABLE_SUFFIX ".js")

target_link_options(PointCloudEngine PRIVATE
    # Enable Emscripten's embind framework
    "--bind"
    
    # Generate an ES6 module that can be imported directly into TypeScript/Angular
    "-sMODULARIZE=1"
    "-sEXPORT_ES6=1"
    "-sEXPORT_NAME=createPointCloudModule"
    
    # Allow the WebAssembly heap to grow dynamically as larger point clouds are loaded
    "-sALLOW_MEMORY_GROWTH=1"
    
    # Optimize for performance (O3) or size (Os/Oz)
    "-O3"
    
    # Catch C++ exceptions cleanly in JS
    "-sDISABLE_EXCEPTION_CATCHING=0"
)

# Output directory for the generated build artifacts (.wasm and .js glue code)
set_target_properties(PointCloudEngine PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/frontend/public/wasm"
)