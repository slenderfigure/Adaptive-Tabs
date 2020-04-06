import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabIndicatorComponent } from './components/tabs/tab-header/tab-indicator/tab-indicator.component';
import { TabHeaderComponent } from './components/tabs/tab-header/tab-header.component';
import { NavButtonComponent } from './components/tabs/tab-header/nav-button/nav-button.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TabsComponent,
    TabIndicatorComponent,
    TabHeaderComponent,
    NavButtonComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
