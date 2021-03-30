import { TestBed } from '@angular/core/testing';

import { MqttDeviveService } from './mqtt-devive.service';

describe('MqttDeviveService', () => {
  let service: MqttDeviveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttDeviveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
