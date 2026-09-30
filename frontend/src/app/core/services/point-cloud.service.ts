import { signal, computed } from '@angular/core';
import { Service } from '@angular/core';

@Service()
export class PointCloudService {
  readonly pointCount = signal<number>(10000);
  // Start as true so the button is disabled immediately on load
  readonly isLoading = signal<boolean>(true);
  readonly isEngineReady = signal<boolean>(false);

  readonly statusSummary = computed(() => {
    if (this.isLoading()) return 'Processing spatial buffers via WASM...';
    return `Active Point Budget: ${this.pointCount().toLocaleString()} points`;
  });

  private wasmModule: any = null;
  private engineInstance: any = null;

  private onPointsUpdated?: (positions: Float32Array) => void;

  constructor() {
    this.initWasm();
  }

  public setLoading(value: boolean): void {
    this.isLoading.set(value);
  }

  public setPointCount(value: number): void {
    this.pointCount.set(value);
  }

  public registerUpdateCallback(callback: (positions: Float32Array) => void): void {
    this.onPointsUpdated = callback;
  }

  private async initWasm(): Promise<void> {
    this.setLoading(true);
    try {
      // Dynamic import or standard script tag with locateFile configuration
      const script = document.createElement('script');
      script.src = '/wasm/pointCloudModule.js';
      script.async = true;

      script.onload = async () => {
        const moduleFactory = (window as any).createPointCloudModule;
        if (moduleFactory) {
          this.wasmModule = await moduleFactory({
            locateFile: (path: string) => {
              if (path.endsWith('.wasm')) {
                return `/wasm/${path}`;
              }
              return path;
            },
          });
          this.engineInstance = new this.wasmModule.PointCloudEngine();
          this.isEngineReady.set(true);
          this.loadInitialDemoPoints();
          console.log('C++20 WASM Engine initialized successfully.');
        }
        this.setLoading(false);
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Failed to load WASM module:', error);
      this.setLoading(false);
    }
  }

  private loadInitialDemoPoints(): void {
    if (!this.wasmModule || !this.engineInstance) return;

    const count = 10000;
    const rawData = new this.wasmModule.VectorFloat();
    for (let i = 0; i < count; i++) {
      rawData.push_back((Math.random() - 0.5) * 10.0);
      rawData.push_back((Math.random() - 0.5) * 10.0);
      rawData.push_back((Math.random() - 0.5) * 10.0);
      rawData.push_back(Math.random());
    }

    this.engineInstance.loadPoints(rawData);
    rawData.delete();

    this.engineInstance.applyVoxelGridFilter(this.voxelSize());

    this.updatePointCountAndBuffers();
  }

  readonly voxelSize = signal<number>(0.5);

  public setVoxelSize(value: number): void {
    this.voxelSize.set(value);
  }

  public triggerVoxelFilter(): void {
    if (!this.engineInstance) {
      console.warn('WASM engine not ready yet.');
      return;
    }
    this.setLoading(true);

    // Pass the dynamic signal value straight into your C++ WASM engine
    this.engineInstance.applyVoxelGridFilter(this.voxelSize());

    this.updatePointCountAndBuffers();
    this.setLoading(false);
  }

  private updatePointCountAndBuffers(): void {
    const processedVector = this.engineInstance.getProcessedPoints();
    const size = processedVector.size();

    const flatArray = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      flatArray[i] = processedVector.get(i);
    }
    processedVector.delete();

    const actualPointsCount = Math.floor(size / 4);
    this.setPointCount(actualPointsCount);

    if (this.onPointsUpdated) {
      this.onPointsUpdated(flatArray);
    }
  }
}
