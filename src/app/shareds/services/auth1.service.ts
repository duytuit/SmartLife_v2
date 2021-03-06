import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth1Service  extends BaseService {

 
  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private manager = new UserManager(getClientSettings());

  private user: User | null;

  constructor(private http: HttpClient) { 
    
    super();     
    
    this.manager.getUser().then(user => { 
      this.user = user;      
      this._authNavStatusSource.next(this.isAuthenticated());
    });
  }

  login() { 
    
    return this.manager.signinRedirect();   
  }
  loginapi(data:any):Observable<any> { 
    return this.http.post<any>(environment.authApiURI+'/api/accountv1/login',data);
  }
  async completeAuthentication() {
      this.user = await this.manager.signinRedirectCallback();
      sessionStorage.setItem('username',this.user.profile.name)
      sessionStorage.setItem('userid',this.user.profile.sub)
    
      this._authNavStatusSource.next(this.isAuthenticated());    
  }  

  register(userRegistration: any) {    
    return this.http.post(environment.authApiURI + '/api/account', userRegistration).pipe(catchError(this.handleError));
  }
  resetpass(username:string) {   
    let resetpass =[
      {
        "UserName": username,
        "Password": 'Dxmb@123456',
        "ConfirmPassword": 'Dxmb@123456',
        "Token": this.user.access_token
      }
    ]
    return this.http.post(environment.authApiURI + '/api/account/ResetPassword', resetpass[0]).pipe(catchError(this.handleError));
  }
  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
    
  }

  get authorizationHeaderValue(): string {
    if(this.user)
    {
      return `${this.user.token_type} ${this.user.access_token}`;
    }
  }

  get name(): string {
    return this.user != null ? this.user.profile.name : '';
  }

  async signout() {
    await this.manager.signoutRedirect();
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('userid')
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
      authority: 'http://localhost:5000',
      client_id: 'smartlife_spa',
      redirect_uri: 'http://localhost:4300/',
      post_logout_redirect_uri: 'http://localhost:4300/',
      response_type:"id_token token",
      scope:"openid profile email api.read",
      filterProtocolClaims: true,
      loadUserInfo: true,
      automaticSilentRenew: true,
      silent_redirect_uri: 'http://localhost:4300/silent-refresh.html'
  };
}
