import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MoneyComponent } from './money/money.component';
import { MobileAppsComponent } from './mobile-apps/mobile-apps.component';

import { AlertModule } from '../../node_modules/ngx-bootstrap';

import { UpgradesComponent } from './upgrades/upgrades.component';
import { SnakeEmulatorComponent } from './snake-emulator/snake-emulator.component';
import { HearthstoneEmulatorComponent } from './hearthstone-emulator/hearthstone-emulator.component';
import { HeroPortraitComponent } from './hearthstone-emulator/hero-portrait/hero-portrait.component';
import { MonsterlaneComponent } from './hearthstone-emulator/monsterlane/monsterlane.component';
import { PerudoEmulatorComponent } from './perudo-emulator/perudo-emulator.component';

@NgModule({
  declarations: [
    AppComponent,
    MoneyComponent,
    MobileAppsComponent,
    UpgradesComponent,
    SnakeEmulatorComponent,
    HearthstoneEmulatorComponent,
    HeroPortraitComponent,
    MonsterlaneComponent,
    PerudoEmulatorComponent
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