import { Component, ViewChild } from '@angular/core';
import { MobileApp } from './domain/mobile-app';
import { MobileAppCloneCounter } from 'app/domain/mobile-app-clone-counter';
import { AlertMessage } from 'app/domain/alert-message';
import { ProgressionTracker } from 'app/domain/progression-tracker';
import { Upgrade } from 'app/domain/upgrade';
import { MobileAppsComponent } from 'app/mobile-apps/mobile-apps.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  streamingApp: MobileApp;
  isStreaming = false;
  title = 'Mobile developer';
  income = 0;
  balance = 0;
  alertMessages : AlertMessage[] = [];
  progressionTracker = <ProgressionTracker>{
    developpedApps : [], 
    keyboardUpgradeLevel: 0, 
    addsUpgradeLevel: 0, 
    contractUpgradeLevel: 0, 
    shortcutUpgradeLevel: 0
  };

  @ViewChild(MobileAppsComponent) mobileAppsComponent : MobileAppsComponent;

  mobileAppCallback(app: MobileApp){
      // console.log("mobileAppCallback", "PARENT : Received app '"+app.name+"'!");
      let devApp = this.progressionTracker.developpedApps.find(devApp => devApp.app.name == app.name);
      if(devApp) devApp.count++;
      else this.progressionTracker.developpedApps.push({app: app, count: 1});
      this.income += app.income;
  }

  attemptToPublishAppCallback(index: number){
    let app = this.mobileAppsComponent.apps[index];
    // console.log("attemptToPublishCallback", app);
    if(app){
      if(app.isUnlocked){
        if(app.cost <= this.mobileAppsComponent.codePower){
          this.mobileAppsComponent.develop(app);
          // this.showInfo("You published a "+app.name+" clone!");
        } else this.showWarning("Attempted to publish app "+app.name+" but insufficient code has been written!")
      } else this.showWarning("Attempted to publish app "+app.name+" but this app is not yet unlocked! Publish earlier apps!");
    } else this.showError("Attempted to publish app "+index+" but none was found!");
  }

  incomeCallback(balance: number){
    this.balance = balance;
  }
  
  promoteCallback(app:MobileApp){
    this.isStreaming = true;
    this.streamingApp = app;
  }

  promotionSuccessCallback(message: string){
    let gains = this.streamingApp.income * this.progressionTracker.developpedApps.find(appCounter => {
      return appCounter.app.name == this.streamingApp.name;
    })
    .count * 10;
    this.showSuccess("Your stream campaign for '" + this.streamingApp.name + " Clone' accrued a total of $ " + gains + "!");
    this.balance += gains;
    this.streamingApp.isPromotable = false;
    this.isStreaming = false;
  }

  promotionDefeatCallback(message: string){
    this.showInfo("Your stream campaign ended but unfortunately you suck so no $! ("+message+")");
    this.streamingApp.isPromotable = false;
    this.isStreaming = false;
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

  //region alerts
  showInfo(message : string){ this.showAlert(<AlertMessage>{text: message, type: "info"})}
  showSuccess(message : string){ this.showAlert(<AlertMessage>{text: message, type: "success"})}
  showWarning(message : string){ this.showAlert(<AlertMessage>{text: message, type: "warning"})}
  showError(message : string){ this.showAlert(<AlertMessage>{text: message, type: "danger"})}
  
  showAlert(alert: AlertMessage){
    this.alertMessages.push(alert); // add alert
    setTimeout(() => {
      if(this.alertMessages.indexOf(alert) >= 0)
        this.alertMessages.splice(this.alertMessages.indexOf(alert), 1); // Remove alert
    }, 5000);
  }

  handleClickAlert(alert: AlertMessage){
    this.alertMessages.splice(this.alertMessages.indexOf(alert), 1); // Remove alert
  }
}