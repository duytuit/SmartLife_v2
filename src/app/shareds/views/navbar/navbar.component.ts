import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Auth1Service } from '../../services/auth1.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() EventScriptDeviceClicked= new EventEmitter();
  @Output() EventDeviceClicked= new EventEmitter();
  @Output() EventSetupDeviceClicked= new EventEmitter();

  constructor(private appService: AppService, private authService: Auth1Service, private router: Router, ) { }
  isCollapsed = true;
  ngOnInit() {
  }

  toggleSidebarPin() {
    this.appService.toggleSidebarPin();
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }
  async Logout() {
    await this.authService.signout();
  }
  ScriptDevice() {
    this.EventScriptDeviceClicked.emit();
    this.isCollapsed = true
    this.router.navigate(['home/script-device']);
  }
  Device() {
    this.EventDeviceClicked.emit();
    this.isCollapsed = true
    this.router.navigate(['home']);
  }
  SetupDevice(){
    this.EventSetupDeviceClicked.emit();
    this.isCollapsed = true
    this.router.navigate(['home/setup']);
  }
}
