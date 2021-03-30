import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteDeviceComponent } from './remote-device.component';

describe('RemoteDeviceComponent', () => {
  let component: RemoteDeviceComponent;
  let fixture: ComponentFixture<RemoteDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
