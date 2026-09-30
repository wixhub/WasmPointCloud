#include "PointCloudEngine.hpp"
#include <unordered_map>
#include <cmath>
#include <algorithm>
#include <iostream> // Required for std::cout logging

// Structure to represent 3D voxel grid coordinates for spatial downsampling
struct VoxelKey
{
    int x, y, z;

    // Equality operator required for unordered_map key comparison
    bool operator==(const VoxelKey &other) const
    {
        return x == other.x && y == other.y && z == other.z;
    }
};

// Custom hash function for VoxelKey to enable efficient lookups in unordered_map
struct VoxelKeyHash
{
    std::size_t operator()(const VoxelKey &k) const
    {
        return std::hash<int>()(k.x) ^ (std::hash<int>()(k.y) << 1) ^ (std::hash<int>()(k.z) << 2);
    }
};

// Loads raw interleaved point data [x, y, z, intensity] and stores a master backup copy
void PointCloudEngine::loadPoints(const std::vector<float> &rawData)
{
    originalPoints.clear();

    // Parse raw array into structured 3D points
    for (size_t i = 0; i + 3 < rawData.size(); i += 4)
    {
        originalPoints.push_back({rawData[i], rawData[i + 1], rawData[i + 2], rawData[i + 3]});
    }

    // Initialize current working points with the full original set
    points = originalPoints;
}

// Flattens the processed points back into an interleaved std::vector<float> for JS marshaling
std::vector<float> PointCloudEngine::getProcessedPoints() const
{
    std::vector<float> result;
    result.reserve(points.size() * 4);

    for (const auto &p : points)
    {
        result.push_back(p.x);
        result.push_back(p.y);
        result.push_back(p.z);
        result.push_back(p.intensity);
    }

    return result;
}

// Applies a Voxel Grid downsampling filter based on the provided voxel size
void PointCloudEngine::applyVoxelGridFilter(float voxelSize)
{
    // Debug log to check incoming voxel size from Angular/TypeScript
    std::cout << "[WASM Engine] Received voxelSize: " << voxelSize << std::endl;

    if (voxelSize <= 0.0f || originalPoints.empty())
    {
        return;
    }

    std::unordered_map<VoxelKey, Point3D, VoxelKeyHash> voxelMap;

    // Always bucket points starting from the full master backup cloud (originalPoints)
    for (const auto &p : originalPoints)
    {
        int vx = static_cast<int>(std::floor(p.x / voxelSize));
        int vy = static_cast<int>(std::floor(p.y / voxelSize));
        int vz = static_cast<int>(std::floor(p.z / voxelSize));

        VoxelKey key{vx, vy, vz};

        // If the voxel is empty, store this representative point
        if (voxelMap.find(key) == voxelMap.end())
        {
            voxelMap[key] = p;
        }
    }

    // Rebuild the working point cloud from the filtered voxel map
    points.clear();
    points.reserve(voxelMap.size());
    for (const auto &pair : voxelMap)
    {
        points.push_back(pair.second);
    }

    // Debug log to verify the resulting point budget after filtering
    std::cout << "[WASM Engine] Filtered points count: " << points.size() << std::endl;
}