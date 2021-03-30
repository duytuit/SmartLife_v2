import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../services/app.service';
import { MqttDeviveService } from '../../services/mqtt-devive.service';
import { userHub } from '../../models/user-hub';
import { ToasterService } from '../../services/toaster.service';
import { devicemqtt } from '../../models/device.mqtt';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Auth1Service } from '../../services/auth1.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MqttSocketService } from '../../services/mqtt-socket.service';
import { tap } from 'rxjs/operators';
import { switchmqtt } from '../../models/switch.mqtt';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() zIndex: number = 2000;
  GetAllUserHub: userHub[]
  GetAllDevice: devicemqtt[]
  FGetAllDevice: devicemqtt[]
  SelectDevice
  MessagerLoading: string
  selectdevice = new devicemqtt()
  private userid = sessionStorage.getItem('userid')
  private username = sessionStorage.getItem('username')
  ResultIDdevice
  ResultTypedevice
  @ViewChild('ChangeHubCode', { static: false }) ChangeHubCode: ElementRef;
  @ViewChild('statusSaveDevice', { static: false }) statusSaveDevice: ElementRef;
  @ViewChild('onDeletebevice', { static: false }) onDeletebevice: ElementRef;
  public showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(true);

  checkshowSpinner: boolean = false

  GetSwitch: switchmqtt[]
  GetAllSwitch: any[] = [] // mảng lưu tất cả các trạng thái switch
  GetAllSwitchTam: any[] = [] // mảng lưu tất cả các trạng thái switch tạm thời
  subcribe // biến lưu messager phản hồi Serve Mqtt;
  hub_code // biến lưu bộ điều khiển trung tâm
  code_device // biến lưu ID thiết bị
  count_device_type // biến lưu số switch
  array_sub = []      // biến test 
  count_sub: number   // biến test 
  modalTitleDevice //tiêu đề khi bật modal xem trạng thái công tắc thiết bị

  addDevice: FormGroup;
  newSwitch = new FormGroup(
    {
      name_switch: new FormControl(),
      icon: new FormControl({ value: '', disabled: true }),
      status: new FormControl(true),
    }
  );

  constructor(
    private appService: AppService,
    public _mqttDeviveService: MqttDeviveService,
    private _toaster: ToasterService,
    private _mqttSocketService: MqttSocketService,
    private fb: FormBuilder,
  ) {
    this._mqttSocketService.subcribe$.subscribe(sq => {
      this.GetAllSwitch = []
      debugger
      this.count_sub = this.array_sub.push(sq['Payload'])
      this.subcribe = sq['Payload']
      let TopicMess = sq['Topic_result']
      if (this.subcribe != undefined) {
        // phản hồi messager new_device
        let newdevice = sq['Payload']['type']
        if (newdevice == 'device_connected') {
          this.ResultIDdevice = sq['Payload']['id_device']
          this.ResultTypedevice = sq['Payload']['type_device']
          this.addDevice.controls['code_device'].reset(sq['Payload']['id_device'].toString());
          this.addDevice.controls['device_type'].reset(sq['Payload']['type_device'].toString());
        }
        // phản hồi messager stt_device_sv

        if (newdevice == 'state_device' && this.selectdevice.code_device === sq['Payload']['device'].toString()) {
          let device_type = parseInt(this.selectdevice.device_type)
          for (let x = 0; x < device_type; x++) {
            let arr =
            {
              "Status": sq['Payload']['sw' + x]
            }
            this.GetAllSwitch.push(arr)
          }
          this.GetAllSwitchTam = this.GetAllSwitch
          this.getallswitch(this.GetAllSwitchTam)

        }
        // phản hồi messager remote
        if (newdevice == 'remote' && this.selectdevice.code_device === sq['Payload']['device'].toString()) {

          for (let x = 0; x < this.GetAllSwitchTam.length; x++) {
            if (sq['Payload']['switch'] === x) {
              this.GetAllSwitchTam[x]['Status'] = sq['Payload']['state']
            }
          }
          this.GetAllSwitch = this.GetAllSwitchTam
          this.getallswitch(this.GetAllSwitch)
        }
      }
    });
  }
  getClasses() {
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }
  ngOnInit() {
    this._mqttSocketService.startSocket();
    this._mqttDeviveService.showSpinner.next(true)
    this._toaster.subject.next(null)
    this.addDevice = this.fb.group({
      name_device: new FormControl(),
      code_device: new FormControl(),
      device_type: new FormControl(),
      number_switch: this.fb.array([]),
      hubid: new FormControl(),
      hub_code: new FormControl(),
      hub_password_client: new FormControl(),
      hub_room_name: new FormControl(),
      icon: new FormControl(),
      note: new FormControl(),
      status: new FormControl(true),
      userid_by: new FormControl(),
      created_by: new FormControl(),
      status_device: new FormControl(),
    });
    this.getAlluserhub(this.userid)

  }
  getArrayControlsDevice() {
    return (this.addDevice.get('number_switch') as FormArray).controls;
  }
  addSwitch() {
    const creds = this.addDevice.controls.number_switch as FormArray;
    creds.push(this.newSwitch);
  }
  onFileUpload(file, i) {

  }
  getAlluserhub(userid: string) {
    
    this._mqttDeviveService.GetUserHub(userid).subscribe(data => {
      this.GetAllUserHub = data
      this.ChangeHubCode.nativeElement.value = this.GetAllUserHub[0].hubid
      this.SelectDevice = this.GetAllUserHub[0]
      this.hub_code = this.GetAllUserHub[0].hub_code
      this.getAllDeviceByHub(this.GetAllUserHub[0].hubid)
      this.Subcriber(this.hub_code + '/log')
    });

  }
  getAllDeviceByHub(hubid: string) {
    
    this._mqttDeviveService.GetDeviceMqtt(hubid).subscribe(data => {
      this.GetAllDevice = data
      this.FGetAllDevice = this.GetAllDevice
    });
  }
  onEventHubCode(hubid: string) {
    this._mqttDeviveService.showSpinner.next(true)
    this.getAllDeviceByHub(hubid)
    this.SelectDevice = this.GetAllUserHub.filter(x => x.hubid == hubid)[0]
    this.hub_code = this.SelectDevice.hub_code
    this.Subcriber(this.hub_code + '/log')
  }
  _FilterDevice: string;
  get FilterDevice(): string {
    return this._FilterDevice;
  }
  set FilterDevice(value: string) {
    this._FilterDevice = value;
    this.FGetAllDevice = this.FilterDevice ? this.PerformFilter(this.FilterDevice) : this.GetAllDevice;
  }
  PerformFilter(filterBy: string): devicemqtt[] {
    filterBy = filterBy.toLowerCase();
    return this.GetAllDevice.filter((device: devicemqtt) =>
      device.name_device.toLowerCase().indexOf(filterBy) !== -1);
  }
  onSubmitDevice() {
    this.statusSaveDevice.nativeElement.disabled = true;
    if (this.selectdevice.edittable == true) {
      const creds = this.addDevice.controls.number_switch as FormArray;
      this.selectdevice.name_device = this.addDevice.controls['name_device'].value;
      this.selectdevice.icon = this.addDevice.controls['icon'].value;
      this.selectdevice.note = this.addDevice.controls['note'].value;
      this.selectdevice.status = this.addDevice.controls['status'].value;
      this.selectdevice.number_switch = creds.value
      this.selectdevice.userid_by = this.userid
      this.selectdevice.created_by = this.username
      this._mqttDeviveService.UpdateDeviceMqtt(this.selectdevice).subscribe(data => {
        this.getAllDeviceByHub(this.SelectDevice.hubid)
        this._toaster.show('success', 'Sửa Thiết Bị!', 'Thành Công');
        let element: HTMLElement = document.getElementById('modalDeviceClose') as HTMLElement;
        element.click();
      });
    } else {
      if (this.addDevice.controls['name_device'].value) {
        this.addDevice.controls['hubid'].reset(this.SelectDevice.hubid);
        this.addDevice.controls['hub_code'].reset(this.SelectDevice.hub_code);
        this.addDevice.controls['hub_password_client'].reset(this.SelectDevice.hub_password_client);
        this.addDevice.controls['hub_room_name'].reset(this.SelectDevice.note);
        this.addDevice.controls['userid_by'].reset(this.userid);
        this.addDevice.controls['created_by'].reset(this.username);
        this._mqttDeviveService.AddDeviceMqtt(this.addDevice.value).subscribe(data => {
          this.Publisher(this.hub_code + '/confirm', 1);
          this.addDevice.controls['name_device'].reset()
          this._toaster.show('success', 'Thêm Thiết Bị!', 'Thành Công');
          let element: HTMLElement = document.getElementById('modalDeviceClose') as HTMLElement;
          element.click();
        });
      } else {
        this.statusSaveDevice.nativeElement.disabled = false;
        this._toaster.show('warning', 'Chưa đặt tên thiết bị!', 'Thất bại');
      }

    }
  }
  openDeleteDevice(item: devicemqtt) {
    this.selectdevice = item
    this.onDeletebevice.nativeElement.disabled = false
    let element: HTMLElement = document.getElementById('modalDelete') as HTMLElement;
    element.click();
  }
  onDeleteDevice(id: string) {
    if (id) {
      this.onDeletebevice.nativeElement.disabled = true
      this._mqttDeviveService.DeleteDeviceMqtt(id).subscribe(data => {
        this.getAllDeviceByHub(this.SelectDevice.hubid)
        this._toaster.show('success', 'Xóa Thiết Bị!', 'Thành Công');
        let element: HTMLElement = document.getElementById('modalDeleteHide') as HTMLElement;
        element.click();
      });

    }
  }
  openEditDevice(item: devicemqtt) {
    this.statusSaveDevice.nativeElement.disabled = false;
    this.selectdevice = item;
    this.selectdevice.edittable = true
    this.addDevice.controls['name_device'].reset(item.name_device);
    this.addDevice.controls['code_device'].reset(item.code_device);
    this.addDevice.controls['device_type'].reset(item.device_type);
    const creds = this.addDevice.controls.number_switch as FormArray;
    creds.clear()
    for (let i = 0; i < item.number_switch.length; i++) {
      creds.push(this.fb.group({
        id: item.number_switch[i].id,
        deviceid: item.number_switch[i].deviceid,
        name_switch: item.number_switch[i].name_switch,
        icon: { value: item.number_switch[i].icon, disabled: true },
        status: item.number_switch[i].status
      }));
    }
    this.addDevice.controls['hubid'].reset(item.hubid);
    this.addDevice.controls['hub_password_client'].reset(item.hub_password_client);
    this.addDevice.controls['hub_room_name'].reset(item.hub_room_name);
    this.addDevice.controls['hub_code'].reset(item.hub_code);
    this.addDevice.controls['icon'].reset(item.icon);
    this.addDevice.controls['note'].reset(item.note);
    this.addDevice.controls['status'].reset(item.status);
    this.addDevice.controls['userid_by'].reset(item.userid_by);
    let element: HTMLElement = document.getElementById('modalDeviceShow') as HTMLElement;
    element.click();
  }
  openmodaladdDevice() {
    this.statusSaveDevice.nativeElement.disabled = false;
    this.addDevice.reset()
    this.selectdevice = new devicemqtt()
    let element: HTMLElement = document.getElementById('modalDeviceShow') as HTMLElement;
    element.click();
  }
  SearchDevice() {

    this.addDevice.controls['code_device'].reset()
    this.addDevice.controls['device_type'].reset()
    this.statusSaveDevice.nativeElement.disabled = false;
    this.Publisher(this.hub_code + '/mode', 2);
    let element: HTMLElement = document.getElementById('modalFindDeviceShow') as HTMLElement;
    element.click();
    this.showSpinner.next(true)
    this.delay(2000).then(any => {

      this.Publisher(this.hub_code + '/find_device', 1);
      this.delay(2000).then(any => {
        this.showSpinner.next(false)
        if (this.addDevice.controls['code_device'].value && this.addDevice.controls['device_type'].value) {
          let device_type = parseInt(this.addDevice.controls['device_type'].value)
          const creds = this.addDevice.controls.number_switch as FormArray;
          for (let i = 0; i < device_type; i++) {
            creds.push(this.fb.group({
              name_switch: 'Công tắc ' + i,
              icon: { value: '', disabled: true },
              status: true
            }));
          }
          this.MessagerLoading = null
          this.statusSaveDevice.nativeElement.disabled = false;
          let element2: HTMLElement = document.getElementById('modalDeviceShow') as HTMLElement;
          element2.click();
        }
      })
    })

  }
  CloseFindDevice() {
    this.addDevice.controls['name_device'].reset()
    this.Publisher(this.hub_code + '/mode', 1);
    this.MessagerLoading = null
    let element: HTMLElement = document.getElementById('modalFindDeviceHide') as HTMLElement;
    element.click();
    this._mqttDeviveService.showSpinner.next(true)
    this.getAllDeviceByHub(this.SelectDevice.hubid)
  }
  CloseDevice() {
    this.addDevice.controls['name_device'].reset()
    // this.addDevice.controls['code_device'].reset()
    // this.addDevice.controls['device_type'].reset()
    let element: HTMLElement = document.getElementById('modalDeviceClose') as HTMLElement;
    element.click();
  }
  FindDevice() {
    this.showSpinner.next(true)
    this.Publisher(this.hub_code + '/find_device', 1);
    this.delay(2000).then(any => {
      this.showSpinner.next(false)
      if (this.addDevice.controls['code_device'].value && this.addDevice.controls['device_type'].value) {
        let device_type = parseInt(this.addDevice.controls['device_type'].value)
        const creds = this.addDevice.controls.number_switch as FormArray;
        creds.clear()
        for (let i = 0; i < device_type; i++) {
          creds.push(this.fb.group({
            name_switch: 'Công tắc ' + i,
            icon: { value: '', disabled: true },
            status: true
          }));
        }
        this.MessagerLoading = null
        this.statusSaveDevice.nativeElement.disabled = false;
        let element2: HTMLElement = document.getElementById('modalDeviceShow') as HTMLElement;
        element2.click();
      }
    })

  }
  // function delay
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms));
  }
  RemoteDevice(item: devicemqtt) {

    this.GetSwitch = item.number_switch
    this.Publisher(this.hub_code + '/get_stt', item.code_device);
    this.selectdevice = item;
    this.showSpinner.next(true)
    let element: HTMLElement = document.getElementById('modalRemoteShow') as HTMLElement;
    element.click();
    this.delay(1000).then(any => {
      this.showSpinner.next(false)
      this.GetAllSwitchTam = this.GetAllSwitch
    })

  }
  Publisher(TopicPublished, MessagerTopicPublished) {

    if (TopicPublished && MessagerTopicPublished) {
      let req = [
        {
          "Name": 'Publisher',
          "Topic": TopicPublished,
          "Messager": MessagerTopicPublished
        }
      ];
      this._mqttSocketService.sendMqttRequest(req);
    }
  }
  Subcriber(TopicSubcribed) {
    if (TopicSubcribed) {
      let req = [
        {
          "Name": 'Subcriber',
          "Topic": TopicSubcribed,
          "Messager": null
        }
      ];
      this._mqttSocketService.sendMqttRequest(req);
    }
  }
  ChangeStatusSwitch(item, i) {

    this.GetAllSwitchTam = this.GetAllSwitch

    var el: HTMLElement = document.getElementById('status-' + i);
    var eltext: HTMLElement = document.getElementById('text-' + i);

    if (item['status_switch'] == 0) {
      this.Publisher(this.hub_code + '/remote', this.selectdevice.code_device + '/' + parseInt(i) + '/' + 1)
      el.style.left = "43px";
      eltext.style.backgroundColor = "#3dbf87";
    }
    if (item['status_switch'] == 1) {
      this.Publisher(this.hub_code + '/remote', this.selectdevice.code_device + '/' + parseInt(i) + '/' + 0)
      el.style.left = "5px";
      eltext.style.backgroundColor = "#fc3164";
    }
  }
  getallswitch(item) {
    for (let i = 0; i < this.GetSwitch.length; i++) {
      this.GetSwitch[i].status_switch = item[i]['Status']
    }
  }
  EventScriptDeviceClicked(){
    let elbardevice: HTMLElement = document.getElementById('bar-device');
        elbardevice.style.display='none'
    let eldevicecontent: HTMLElement = document.getElementById('device-content');
        eldevicecontent.style.display='none'
    let elrouteroutletcontent: HTMLElement = document.getElementById('router-outlet-content');
        elrouteroutletcontent.style.display='block'
    let elpagescontainer: HTMLElement = document.getElementById('pages-container');
    elpagescontainer.style.marginTop='30px'
    let elmainbody: HTMLElement = document.getElementById('main-body');
       elmainbody.style.height='100vh'
  }
  EventDeviceClicked(){
    let elbardevice: HTMLElement = document.getElementById('bar-device');
        elbardevice.style.display='flex'
    let eldevicecontent: HTMLElement = document.getElementById('device-content');
        eldevicecontent.style.display='block'
    let elrouteroutletcontent: HTMLElement = document.getElementById('router-outlet-content');
        elrouteroutletcontent.style.display='none'
        let elpagescontainer: HTMLElement = document.getElementById('pages-container');
        elpagescontainer.style.marginTop='0'
        let elmainbody: HTMLElement = document.getElementById('main-body');
        elmainbody.style.height='94vh'
  }
  EventSetupDeviceClicked(){
    let elbardevice: HTMLElement = document.getElementById('bar-device');
        elbardevice.style.display='none'
    let eldevicecontent: HTMLElement = document.getElementById('device-content');
        eldevicecontent.style.display='none'
    let elrouteroutletcontent: HTMLElement = document.getElementById('router-outlet-content');
        elrouteroutletcontent.style.display='block'
        let elpagescontainer: HTMLElement = document.getElementById('pages-container');
        elpagescontainer.style.marginTop='30px'
        let elmainbody: HTMLElement = document.getElementById('main-body');
        elmainbody.style.height='100vh'
  }
}
