import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { scripts } from '../models/script';

@Injectable({
  providedIn: 'root'
})
export class ScriptDeviceService {

  public ApiScriptDevice: string = environment.SmartBuildingapiUrl+"api/script_device";
  public showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(true);
  
  constructor(private http: HttpClient) {
   }
  GetScriptDevice(keyword:string):Observable<scripts[]>{
    return this.http.get<scripts[]>(this.ApiScriptDevice).pipe(
      tap(response => {
        this.showSpinner.next(false)
      }
      ,
        (error: any) =>{
          this.showSpinner.next(false)
        } ));
  }
  DeleteScriptDevice(id:string):Observable<any>{
    const url=`${this.ApiScriptDevice}/${id}`;
    return this.http.delete(url);
  }
  AddScriptDevice(scriptdevice:any[]):Observable<any[]>{
    return this.http.post<any[]>(this.ApiScriptDevice,scriptdevice);
  }
  UpdateScriptDevice(scriptdevice:scripts):Observable<scripts>
  {
    return this.http.put<scripts>(this.ApiScriptDevice,scriptdevice);
  }
}
