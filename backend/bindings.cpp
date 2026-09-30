#include <emscripten/bind.h>
#include "PointCloudEngine.hpp"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(PointCloudEngineModule)
{
    class_<PointCloudEngine>("PointCloudEngine")
        .constructor<>()
        .function("loadPoints", &PointCloudEngine::loadPoints)
        .function("getProcessedPoints", &PointCloudEngine::getProcessedPoints)
        .function("applyVoxelGridFilter", &PointCloudEngine::applyVoxelGridFilter);

    // Bind std::vector<float> for easy JS array marshaling
    register_vector<float>("VectorFloat");
}