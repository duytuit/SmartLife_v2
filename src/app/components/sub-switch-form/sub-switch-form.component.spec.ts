import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSwitchFormComponent } from './sub-switch-form.component';

describe('SubSwitchFormComponent', () => {
  let component: SubSwitchFormComponent;
  let fixture: ComponentFixture<SubSwitchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSwitchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSwitchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
