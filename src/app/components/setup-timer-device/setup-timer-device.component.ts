import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { userHub } from 'src/app/shareds/models/user-hub';
import { ToasterService } from 'src/app/shareds/services/toaster.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MqttDeviveService } from 'src/app/shareds/services/mqtt-devive.service';
import { devicemqtt } from 'src/app/shareds/models/device.mqtt';

@Component({
  selector: 'app-setup-timer-device',
  templateUrl: './setup-timer-device.component.html',
  styleUrls: ['./setup-timer-device.component.css']
})
export class SetupTimerDeviceComponent implements OnInit {
  @Input() zIndex: number = 2000;
  addScript: FormGroup;
  GetAllDevice: devicemqtt[]
  private userid = sessionStorage.getItem('userid')
  private username = sessionStorage.getItem('username')
  hub_code 
  @ViewChild('ChangeHubCode', { static: false }) ChangeHubCode: ElementRef;
  ConditionalScript:FormGroup;

  DeviceAction = new FormGroup(
    {
      device_control: new FormControl(),
      device_switch: new FormControl(),
      device_status: new FormControl(),
    }
  );
  constructor(
    public _mqttDeviveService: MqttDeviveService,
    private _toaster: ToasterService,
    private fb: FormBuilder,) { 
      this.addScript = this.fb.group({
        conditional_script: this.fb.array([this.conditionalscript()]),
      })
    }
    conditionalscript()
    {
     return this.ConditionalScript = this.fb.group({
        type_script: new FormControl(),
        name_script: new FormControl(),
        device_conditional: new FormControl(),
        device_conditional_switch: new FormControl(),
        device_conditional_switch_status: new FormControl(),
        note: new FormControl(),
        status: new FormControl(),
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
    this.getAllDevice()
  }
  getAllDevice() {
    this._mqttDeviveService.GetDeviceMqtt(null).subscribe(data => {
      this.GetAllDevice = data
    });

  }
  onSubmitaddScript() {

  }
  onEventHubCode(hubid: string) {
    this._mqttDeviveService.showSpinner.next(true)
  }
  onEventDevice(deviceid: string){
    
  }
  onEventDeviceAction(deviceid: string)
  {
  }
}
