import { Component, inject } from '@angular/core';
import { PointCloudService } from '../../services/point-cloud.service';

@Component({
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly pcService = inject(PointCloudService);

  public onVoxelSizeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newSize = parseFloat(input.value);

    // Update the signal value
    this.pcService.setVoxelSize(newSize);

    // Immediately execute the WASM filter live!
    this.pcService.triggerVoxelFilter();
  }

  public onTriggerFilter(): void {
    this.pcService.triggerVoxelFilter();
  }
}
