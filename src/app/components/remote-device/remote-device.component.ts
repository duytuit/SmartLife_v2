import { Component, OnInit, Input } from '@angular/core';
import { ToasterService } from 'src/app/shareds/services/toaster.service';
import { MqttSocketService } from 'src/app/shareds/services/mqtt-socket.service';
import { MqttDeviveService } from 'src/app/shareds/services/mqtt-devive.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-remote-device',
  templateUrl: './remote-device.component.html',
  styleUrls: ['./remote-device.component.css']
})
export class RemoteDeviceComponent implements OnInit {
  
  @Input() zIndex: number = 2000;

  GetAllSwitch:any[]=[] // mảng lưu tất cả các trạng thái switch
  private userid= sessionStorage.getItem('userid')
  private username= sessionStorage.getItem('username')
  subcribe // biến lưu messager phản hồi Serve Mqtt;
  hub_code // biến lưu bộ điều khiển trung tâm
  code_device // biến lưu ID thiết bị
  count_device_type // biến lưu số switch
  array_sub=[]      // biến test 
  count_sub:number   // biến test 
  modalTitleDevice //tiêu đề khi bật modal xem trạng thái công tắc thiết bị

  addDevice = new FormGroup(
    {
     // Id :new FormControl(),
      name_device :new FormControl(),
      code_device :new FormControl(),
      device_type :new FormControl(),
      number_switch :new FormControl(),
      hubid :new FormControl(),
      hub_code:new FormControl(),
      hub_password_client:new FormControl(),
      hub_room_name:new FormControl(),
      icon:new FormControl(),
      note:new FormControl(),
      status :new FormControl(true),
      userid_by :new FormControl(),
      created_by :new FormControl(),
      status_device:new FormControl(),
    }
  );

  constructor(
    private _toaster: ToasterService,
    private _deviceMqttService:MqttDeviveService,
    private _mqttSocketService:MqttSocketService,
  ) {
    this._mqttSocketService.subcribe$.subscribe(sq => {
      this.GetAllSwitch=[]
      this.count_sub= this.array_sub.push(sq['Payload'])
     // if(this.count_sub===1||this.count_sub===2)
     // {
            this.subcribe=sq['Payload']
            let TopicMess=sq['Topic_result']
             if(this.subcribe != undefined)
               {
                   // phản hồi messager new_device
                 if(this.hub_code===this.subcribe.split('/')[0].trim())
                 {
                   this.addDevice.controls['code_device'].reset(this.subcribe.split('/')[1].trim());
                   this.addDevice.controls['device_type'].reset(this.subcribe.split('/')[2].trim());
                 }
                 // phản hồi messager stt_device_sv
                 if(TopicMess==='stt_device_sv'&&this.hub_code==this.subcribe.split('/')[0].trim())
                 {
                    for(let x=0;x<this.subcribe.split('/')[2].length;x++)
                    {
                         let arr =
                           {
                             "Status": this.subcribe.split('/')[2][x]
                           }
                           this.GetAllSwitch.push(arr)
                    }
                   //this.subcribe.split('/')[2].length
                   //console.log(this.GetAllSwitch)
                 }
               }
    // }
  // console.log(this.subcribe)
 });
   }

  ngOnInit(): void {
    this._mqttSocketService.startSocket();
  }

}
