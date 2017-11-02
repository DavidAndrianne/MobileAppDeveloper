import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MoneyComponent } from './money/money.component';
import { MobileAppsComponent } from './mobile-apps/mobile-apps.component';

import { AlertModule } from '../../node_modules/ngx-bootstrap';

import { UpgradesComponent } from './upgrades/upgrades.component';

@NgModule({
  declarations: [
    AppComponent,
    MoneyComponent,
    MobileAppsComponent,
    UpgradesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AlertModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}