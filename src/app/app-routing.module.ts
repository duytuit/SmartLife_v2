import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './shareds/views/home/home.component';
import { RemoteDeviceComponent } from './components/remote-device/remote-device.component';
import { WelcomeComponent } from './shareds/views/account/welcome/welcome.component';
import { AuthGuard } from './shareds/core/authentication/auth.guard';
import { SwitchFormComponent } from './components/switch-form/switch-form.component';
import { InfoAccountComponent } from './shareds/views/account/info-account/info-account.component';
import { SetupTimerDeviceComponent } from './components/setup-timer-device/setup-timer-device.component';
import { ScriptDeviceComponent } from './components/script-device/script-device.component';


const routes: Routes = [
  { path: '', component: WelcomeComponent, pathMatch: 'full' },
 { path: 'home', component: HomeComponent,
   children: [
    {
      path: 'script-device',
      component: ScriptDeviceComponent
    },
    {
      path: 'setup',
      component: SetupTimerDeviceComponent
    },
    {
      path: 'profile',
      component: InfoAccountComponent
    },
   ],
  //canActivate: [AuthGuard] 
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
