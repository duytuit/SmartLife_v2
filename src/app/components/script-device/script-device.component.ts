import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-script-device',
  templateUrl: './script-device.component.html',
  styleUrls: ['./script-device.component.css']
})
export class ScriptDeviceComponent implements OnInit {
  addScript: FormGroup;
  private userid = sessionStorage.getItem('userid')
  private username = sessionStorage.getItem('username')
  ConditionalScript:FormGroup;

  DeviceAction = new FormGroup(
    {
      device_control: new FormControl(),
      device_switch: new FormControl(),
      device_status: new FormControl(),
    }
  );

  constructor(private fb: FormBuilder) {
    this.addScript = this.fb.group({
      conditional_script: this.fb.array([this.conditionalscript()]),
    })
  }
  conditionalscript()
  {
   return this.ConditionalScript = this.fb.group({
      name_script: new FormControl(),
      device_conditional: new FormControl(),
      device_conditional_switch: new FormControl(),
      device_conditional_switch_status: new FormControl(),
      device_action: this.fb.array([this.DeviceAction]),
      userid_by: new FormControl(this.userid),
      created_by: new FormControl(this.username),
    });
  }
  getArrayConditionalScript() {
    return (this.addScript.get('conditional_script') as FormArray).controls;
  }
  getArrayDeviceAction() {
    return (this.ConditionalScript.get('device_action') as FormArray).controls;
  }
  addConditionalScript() {
    const creds = this.addScript.controls.conditional_script as FormArray;
    creds.push(this.conditionalscript());
  }
  addDeviceAction() {
    const creds = this.ConditionalScript.controls.device_action as FormArray;
    creds.push(this.DeviceAction);
  }
  removeConditionalScript(i: number) {
    const control = <FormArray>this.addScript.controls['conditional_script'];
    control.removeAt(i);
  }
  removeDeviceAction(i: number) {
    const control = <FormArray>this.ConditionalScript.controls['device_action'];
    control.removeAt(i);
  }
  ngOnInit(): void {
  }
  onSubmitaddScript() {

  }
}
