import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MobileAppCloneCounter } from 'app/domain/mobile-app-clone-counter';
import { ProgressionTracker } from 'app/domain/progression-tracker';

@Component({
  selector: 'money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.css']
})
export class MoneyComponent implements OnInit {
  // Properties

  @Input()
  income : number;

  get incomeWithModifiers() : number {
    let income = this.income;
    if(this.progressionTracker.addsUpgradeLevel >= 1) income*=1.5;
    if(this.progressionTracker.addsUpgradeLevel >= 2) income*=2;
    if(this.progressionTracker.addsUpgradeLevel >= 3) income*=2.5;
    return Math.round(income);
  }
  get incomeModifier() : number{
    let income = this.income; this.income = 1; // take copy of income and assume it's 1
    let modifier = this.incomeWithModifiers; // see what modifier does to income of 1
    this.income = income; // put income back to original state
    return modifier; // return modifier
  }
  @Input()
  balance : number;
  @Input()
  progressionTracker : ProgressionTracker;
  
  @Output()
  addIncome : EventEmitter<number> = new EventEmitter<number>();
  elapsedSec : number = 0;
  incomeEverySecondsBase : number = 10;
  get incomeEverySeconds() : number{
    let incomeEverySeconds = this.incomeEverySecondsBase;
    if(this.progressionTracker.contractUpgradeLevel >= 1) incomeEverySeconds/=1.5;
    if(this.progressionTracker.contractUpgradeLevel >= 2) incomeEverySeconds/=2;
    if(this.progressionTracker.contractUpgradeLevel >= 3) incomeEverySeconds/=2.5;
    return Math.round(incomeEverySeconds);
  }

  constructor() {
    setTimeout(() => this.tick(), 1000);
  }

  tick(){
    if(this.income) this.elapsedSec++;
    
    if(this.elapsedSec % this.incomeEverySeconds == 0){  
      this.balance += this.incomeWithModifiers;
      this.addIncome.emit(this.balance);
    }
    setTimeout(() => this.tick(), 1000); // callback this
  }
  
  ngOnInit() {
  }

  incrementBalance(value: number){
    this.balance = this.balance + value;
  }

   /// adds the current income to the total balance
  tickBalance(){
    this.balance = this.balance + this.income;
  }

  incrementIncome(value: number){
    this.income = this.balance + value;
  }

}