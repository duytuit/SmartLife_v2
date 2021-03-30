import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { devicemqtt } from '../models/device.mqtt';
import { tap } from 'rxjs/operators';
import { userHub } from '../models/user-hub';
import { switchmqtt } from '../models/switch.mqtt';

@Injectable({
  providedIn: 'root'
})
export class MqttDeviveService {
  public Api: string = environment.SmartBuildingapiUrl+"api/device";
  public ApiUserHub: string = environment.SmartBuildingapiUrl+"api/user_hub";
  public showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(true);
  
  constructor(private http: HttpClient) {
   }
   GetUserHub(keyword:string):Observable<userHub[]>{
    let url = `${this.ApiUserHub}?keyword=${keyword}`
    return this.http.get<userHub[]>(url)
  }
  GetDeviceMqtt(keyword:string):Observable<devicemqtt[]>{
    // this.showSpinner.next(true);
    let url = `${this.Api}/smarthub?keyword=${keyword}`
    if(keyword==null)
    {
       url = `${this.Api}/smarthub`
    }
    return this.http.get<devicemqtt[]>(url).pipe(
      tap(response => {
        this.showSpinner.next(false)
      }
      ,
        (error: any) =>{
          this.showSpinner.next(false)
        } ));
  }
  DeleteDeviceMqtt(id:string):Observable<any>{
    const url=`${this.Api}/${id}`;
    return this.http.delete(url);
  }
  AddDeviceMqtt(devicemqtt:any[]):Observable<any[]>{
    return this.http.post<any[]>(this.Api,devicemqtt);
  }
  UpdateDeviceMqtt(devicemqtt:devicemqtt):Observable<devicemqtt>
  {
    return this.http.put<devicemqtt>(this.Api,devicemqtt);
  }
}
