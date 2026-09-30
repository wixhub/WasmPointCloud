import { TestBed } from '@angular/core/testing';
import { PointCloudService } from './point-cloud.service';

describe('PointCloudService', () => {
  let service: PointCloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointCloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
