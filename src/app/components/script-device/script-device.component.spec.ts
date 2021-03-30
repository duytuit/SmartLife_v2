import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptDeviceComponent } from './script-device.component';

describe('ScriptDeviceComponent', () => {
  let component: ScriptDeviceComponent;
  let fixture: ComponentFixture<ScriptDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
