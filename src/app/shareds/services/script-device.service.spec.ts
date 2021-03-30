import { TestBed } from '@angular/core/testing';

import { ScriptDeviceService } from './script-device.service';

describe('ScriptDeviceService', () => {
  let service: ScriptDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
