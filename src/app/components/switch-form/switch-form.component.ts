import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MqttDeviveService } from 'src/app/shareds/services/mqtt-devive.service';

@Component({
  selector: 'app-switch-form',
  templateUrl: './switch-form.component.html',
  styleUrls: ['./switch-form.component.css']
})
export class SwitchFormComponent implements OnInit {

  private userid = sessionStorage.getItem('userid')
  private username = sessionStorage.getItem('username')
  formdevice: FormGroup;
  newSwitch = new FormGroup(
    {
      name_switch :new FormControl('Công tắc 1'),
      icon:new FormControl('hình ảnh'),
      status :new FormControl(true),
    }
  );

  constructor(
    private fb: FormBuilder,
    public _mqttDeviveService: MqttDeviveService,
    ) {
    this.formdevice = this.fb.group({
      name_device :new FormControl('Phòng ngủ'),
      code_device :new FormControl('28'),
      device_type :new FormControl('4'),
      number_switch :this.fb.array([this.newSwitch]),
      hubid :new FormControl('082fef84-3e22-48fa-2e38-08d803ae4d96'),
      hub_code:new FormControl('84F3EB96D633'),
      hub_password_client:new FormControl('abc@123'),
      hub_room_name:new FormControl('căn 101'),
      icon:new FormControl(),
      note:new FormControl(),
      status :new FormControl(true),
      userid_by :new FormControl(this.userid),
      created_by :new FormControl(this.username),
      status_device:new FormControl(),
    });
    for (let i = 0; i < 4; i++) {
      this.addSwitch();
    }
  }
  getArrayControlsDevice() {
    return (this.formdevice.get('number_switch') as FormArray).controls;
  }
  ngOnInit(): void {
  }
  addSwitch() {
    const creds = this.formdevice.controls.number_switch as FormArray;
    creds.push(this.newSwitch);
  }
  onSubmitBodieukhien(){
    var control = <FormArray>this.formdevice.value;
    console.log(this.formdevice.value)
    this._mqttDeviveService.AddDeviceMqtt(this.formdevice.value).subscribe()
  }
}
