import { Component, ElementRef, ViewChild, inject, afterNextRender } from '@angular/core';
import * as THREE from 'three';
import { PointCloudService } from '../../core/services/point-cloud.service';

@Component({
  selector: 'app-viewer',
  styleUrl: './viewer.scss',
  templateUrl: './viewer.html',
})
export class Viewer {
  @ViewChild('canvasContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  readonly pcService = inject(PointCloudService);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private pointsMesh!: THREE.Points;

  constructor() {
    // Ensures Three.js initializes safely after the client-side DOM is fully rendered
    afterNextRender(() => {
      this.initThree();
      this.generateMockPointData();

      // Listen to processed points coming out of C++ WASM
      this.pcService.registerUpdateCallback((positions: Float32Array) => {
        this.updatePointCloudGeometry(positions);
      });
    });
  }

  private initThree(): void {
    const width = this.containerRef.nativeElement.clientWidth;
    const height = this.containerRef.nativeElement.clientHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.containerRef.nativeElement.appendChild(this.renderer.domElement);

    // 3. Animation Loop
    this.renderer.setAnimationLoop(() => {
      if (this.pointsMesh) {
        this.pointsMesh.rotation.y += 0.002; // Slow rotation to show spatial depth
      }
      this.renderer.render(this.scene, this.camera);
    });

    // Handle Window Resizing
    window.addEventListener('resize', () => {
      const w = this.containerRef.nativeElement.clientWidth;
      const h = this.containerRef.nativeElement.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  private createCircularTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Draw a smooth radial gradient circle
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  private generateMockPointData(): void {
    this.pcService.setLoading(true);

    const count = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color = new THREE.Color();

    for (let i = 0; i < count * 3; i += 3) {
      // Create a distributed spatial point cloud cluster
      const x = (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 4;
      const z = (Math.random() - 0.5) * 4;

      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;

      // Color mapping based on height (simulating spatial attribute parsing)
      color.setHSL(0.55 + y * 0.1, 1.0, 0.5);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08, // Adjust size as needed
      vertexColors: true,
      map: this.createCircularTexture(),
      transparent: true,
      alphaTest: 0.01, // Removes the harsh black borders around points
      sizeAttenuation: true,
    });

    this.pointsMesh = new THREE.Points(geometry, material);
    this.scene.add(this.pointsMesh);

    this.pcService.setPointCount(count);
    this.pcService.setLoading(false);
  }

  private updatePointCloudGeometry(positionsArray: Float32Array): void {
    if (!this.pointsMesh) return;

    const geometry = this.pointsMesh.geometry;
    const count = positionsArray.length / 4; // layout: [x, y, z, intensity]

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0, j = 0; i < positionsArray.length; i += 4, j += 3) {
      const x = positionsArray[i];
      const y = positionsArray[i + 1];
      const z = positionsArray[i + 2];
      const intensity = positionsArray[i + 3];

      positions[j] = x;
      positions[j + 1] = y;
      positions[j + 2] = z;

      // Use intensity or spatial height for color mapping
      color.setHSL(0.55 + intensity * 0.4, 1.0, 0.5);
      colors[j] = color.r;
      colors[j + 1] = color.g;
      colors[j + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometry.attributes['position'].needsUpdate = true;
    geometry.attributes['color'].needsUpdate = true;
  }
}
