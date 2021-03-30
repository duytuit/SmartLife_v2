import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTimerDeviceComponent } from './setup-timer-device.component';

describe('SetupTimerDeviceComponent', () => {
  let component: SetupTimerDeviceComponent;
  let fixture: ComponentFixture<SetupTimerDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupTimerDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupTimerDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
