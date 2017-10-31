import { Component } from '@angular/core';
import { MobileApp } from './domain/mobile-app';
import { MobileAppCloneCounter } from 'app/domain/mobile-app-clone-counter';
import { AlertMessage } from 'app/domain/alert-message';
import { ProgressionTracker } from 'app/domain/progression-tracker';
import { Upgrade } from 'app/domain/upgrade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mobile developer';
  income = 0;
  balance = 20000;
  alertMessages : AlertMessage[] = [];
  progressionTracker : ProgressionTracker = <ProgressionTracker>{developpedApps : [], keyboardUpgradeLevel: 0, addsUpgradeLevel: 0, contractUpgradeLevel: 0, shortcutUpgradeLevel: 0};

  mobileAppCallback(app: MobileApp){
      console.log("mobileAppCallback", "PARENT : Received app '"+app.name+"'!");
      let devApp = this.progressionTracker.developpedApps.find(devApp => devApp.app.name == app.name);
      if(devApp) devApp.count++;
      else this.progressionTracker.developpedApps.push({app: app, count: 1});
      this.income += app.income;
  }

  incomeCallback(balance: number){
    this.balance = balance;
  }

  unlockUpgradeCallback(upgrade: Upgrade){
    this.balance -= upgrade.cost;
    switch(upgrade.name){
      case "keyboard":
        this.progressionTracker.keyboardUpgradeLevel++;
        break;
      case "adds":
        this.progressionTracker.addsUpgradeLevel++;
        break;
      case "shortcut":
        this.progressionTracker.shortcutUpgradeLevel++;
        break;
      case "contract":
        this.progressionTracker.contractUpgradeLevel++;
        break;
      default:
        console.error("Expected upgrade but instead got : ", upgrade);
    }
  }

  handleClickAlert(alert: AlertMessage){
    if (alert instanceof AlertMessage){

    }
  }
}
