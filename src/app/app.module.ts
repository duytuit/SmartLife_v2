import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ToastrModule } from 'ngx-toastr';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './shareds/views/home/home.component';
import { NavbarComponent } from './shareds/views/navbar/navbar.component';
import { SidebarComponent } from './shareds/views/sidebar/sidebar.component';
import { FooterComponent } from './shareds/views/footer/footer.component';
import { ModalModule } from 'src/lib/modal';
import { RemoteDeviceComponent } from './components/remote-device/remote-device.component';
import { WelcomeComponent } from './shareds/views/account/welcome/welcome.component';
import { ToasterComponent } from './shareds/toaster/toaster.component';
import { ToasterContainerComponent } from './shareds/toaster-container/toaster-container.component';
import { FakeBackendProvider } from './shareds/mocks/fake-backend-interceptor';
import { AuthProvider } from './shareds/mocks/AuthenticationInterceptorService ';
import { Auth1Service } from './shareds/services/auth1.service';
import { SwitchFormComponent } from './components/switch-form/switch-form.component';
import { SubSwitchFormComponent } from './components/sub-switch-form/sub-switch-form.component';
import { SetupTimerDeviceComponent } from './components/setup-timer-device/setup-timer-device.component';
import { ScriptDeviceComponent } from './components/script-device/script-device.component';
import { InfoAccountComponent } from './shareds/views/account/info-account/info-account.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    RemoteDeviceComponent,
    WelcomeComponent,
    ToasterComponent,
    ToasterContainerComponent,
    SwitchFormComponent,
    SubSwitchFormComponent,
    SetupTimerDeviceComponent,
    ScriptDeviceComponent,
    InfoAccountComponent
  ],
  imports: [
    ModalModule,
    BrowserModule,
    AppRoutingModule,
    CollapseModule.forRoot(),
    ToastrModule.forRoot(),
    MalihuScrollbarModule.forRoot(),
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    Auth1Service,
    FakeBackendProvider,
    AuthProvider
   

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
