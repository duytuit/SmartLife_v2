import { TestBed } from '@angular/core/testing';

import { MqttSocketService } from './mqtt-socket.service';

describe('MqttSocketService', () => {
  let service: MqttSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
