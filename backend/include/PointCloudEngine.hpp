#pragma once
#include <vector>

struct Point3D
{
    float x, y, z, intensity;
};

class PointCloudEngine
{
private:
    std::vector<Point3D> points;
    std::vector<Point3D> originalPoints; // Backup storage

public:
    void loadPoints(const std::vector<float> &rawData);
    std::vector<float> getProcessedPoints() const;
    void applyVoxelGridFilter(float voxelSize);
};