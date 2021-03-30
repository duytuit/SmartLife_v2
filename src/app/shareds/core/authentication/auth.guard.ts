import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth1Service } from '../../services/auth1.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: Auth1Service) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // let g=localStorage.getItem('userid')
    // if (localStorage.getItem('userid')!=null) { return true; }
    if (this.authService.isAuthenticated()) { return true; }
   // this.authService.login();
     this.router.navigate(['']);
    // , { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }
  
}
