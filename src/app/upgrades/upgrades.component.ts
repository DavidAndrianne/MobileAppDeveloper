import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Upgrade } from 'app/domain/upgrade';
import { ProgressionTracker } from 'app/domain/progression-tracker';

@Component({
  selector: 'upgrades',
  templateUrl: './upgrades.component.html',
  styleUrls: ['./upgrades.component.css']
})
export class UpgradesComponent implements OnInit {
  @Input()
  progressionTracker : ProgressionTracker;
  
  @Input()
  balance : number;
  @Output()
  unlockUpgrade = new EventEmitter<Upgrade>();

  upgrades : Upgrade[] = [
    // Keyboard
    <Upgrade>{ name:"keyboard", title:"Buy better hardware. 2x Development power per keystroke", cost:1000, isUnlocked:true, tier:1, imageUrl: "/assets/Upgrades/keyboard_Tier1.png"},
    <Upgrade>{ name:"keyboard", title:"Buy better hardware. 2x Development power per keystroke", cost:4000, tier:2, imageUrl: "/assets/Upgrades/keyboard_Tier2.png"},
    <Upgrade>{ name:"keyboard", title:"Buy better hardware. 2x Development power per keystroke", cost:10000, tier:3, imageUrl: "/assets/Upgrades/keyboard_Tier3.png"},
    
    // Adds
    <Upgrade>{ name:"adds", title:"Secure a new add deals. 1.5x passive income from adds", cost:1000, isUnlocked:true, tier:1, imageUrl: "/assets/Upgrades/adds_Tier1.png"},
    <Upgrade>{ name:"adds", title:"Secure a new add deals. 2x passive income from adds", cost:5000, tier:2, imageUrl: "/assets/Upgrades/adds_Tier2.png"},
    <Upgrade>{ name:"adds", title:"Secure a new add deals. 2.5x passive income from adds", cost:30000, tier:3, imageUrl: "/assets/Upgrades/adds_Tier3.png"},
    
    // Contract
    <Upgrade>{ name:"contract", title:"Secure a more frequent payout from the add company. 1.5x quicker income from adds", cost:1000, isUnlocked:true, tier:1, imageUrl: "/assets/Upgrades/contract_Tier1.png"},
    <Upgrade>{ name:"contract", title:"Secure a more frequent payout from the add company. 2x quicker income from adds", cost:5000, tier:2, imageUrl: "/assets/Upgrades/contract_Tier2.png"},
    <Upgrade>{ name:"contract", title:"Secure a more frequent payout from the add company. 2.5x quicker income from adds", cost:30000, tier:3, imageUrl: "/assets/Upgrades/contract_Tier3.png"},

    // Shortcut
    <Upgrade>{ name:"shortcut", title:"Unlocks shortcut ctrl+1, ctrl+2, ... to quick release app clones", cost:1000, isUnlocked:true, tier:1, imageUrl: "/assets/Upgrades/keyboardShortcut_Tier1.png"},
    <Upgrade>{ name:"shortcut", title:"Unlocks the konami code (Up, Up, Down, Down, Left, Right, Left, Right, B, A) which unlocks a stream event.", cost:4000, tier:2, imageUrl: "/assets/Upgrades/keyboardShortcut_Tier2.png"},
    <Upgrade>{ name:"shortcut", title:"Unlocks autorelease for developped apps", cost:10000, tier:3, imageUrl: "/assets/Upgrades/keyboardShortcut_Tier3.png"},
  ];
  get tier1Upgrades() : Upgrade[] {
    return this.upgrades.filter(upgrade => {return upgrade.tier == 1 && upgrade.isUnlocked;});
  }
  get tier2Upgrades() : Upgrade[] {
    return this.upgrades.filter(upgrade => {return upgrade.tier == 2 && upgrade.isUnlocked;});
  }
  get tier3Upgrades() : Upgrade[] {
    return this.upgrades.filter(upgrade => {return upgrade.tier == 3 && upgrade.isUnlocked;});
  }
  get getTierUpgrades() : Array<Array<Upgrade>>{
    return [this.tier1Upgrades, this.tier2Upgrades, this.tier3Upgrades];
  }

  constructor() { }

  ngOnInit() {
  }

  buyUpgrade(upgrade : Upgrade){
    console.log("bought upgrade", upgrade);
    upgrade.isBought = true; // buy upgrade

    let nextUpgradeTier = this.upgrades.find(upg => { return upg.name == upgrade.name && upg.tier == upgrade.tier+1;});
    if(nextUpgradeTier) nextUpgradeTier.isUnlocked = true; // unlock next tier
    
    this.unlockUpgrade.emit(upgrade); // pay for upgrade
  }

}
