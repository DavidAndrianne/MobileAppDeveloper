import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PerudoGame } from 'app/domain/perudo-emulator/perudo-game';
import { Player, AiPlayer } from 'app/domain/perudo-emulator/player';
import { Bid } from 'app/domain/perudo-emulator/bid';
import { Die } from 'app/domain/perudo-emulator/die';
import { AiAction, ActionType } from 'app/domain/perudo-emulator/ai';

@Component({
  selector: 'perudo-emulator',
  templateUrl: './perudo-emulator.component.html',
  styleUrls: ['./perudo-emulator.component.css']
})
export class PerudoEmulatorComponent implements OnInit {
  @Output()
  victory = new EventEmitter<string>();
  @Output()
  defeat = new EventEmitter<string>();

  app : PerudoGame;
  player : Player;
  proposedBids : Bid[];
  action : AiAction;
  bullshittedBid : Bid;
  get isBullshit() : boolean{
    let bullshit = (!this.action) ? false : this.action.type == ActionType.bullshit;
    return bullshit;
  }
  rerollInSec = 0;

  constructor() { }

  ngOnInit() {
    this.app = new PerudoGame(3, 3);
    this.player = this.app.players[0];
    this.playAiTurn();
  }

  dice(bid: Bid){
    if(!bid) return [];
    let dice = [];
    for(let i = 0; i < bid.quantity; i++){
      let die = new Die();
      die.value = bid.value;
      dice.push(die)
    }
    return dice;
  }

  setInitialBid(bid : Bid){
    this.app.raiseBid(bid);
    this.playAiTurn();
  }

  raiseValue(bid : Bid, value : number) {
    this.app.raiseBid(bid);
    this.playAiTurn();
  }

  raiseQuantity(bid : Bid, quantity : number){
    this.app.raiseBid(bid);
    this.playAiTurn();
  }

  paco(bid : Bid){
    this.app.raiseBid(bid);
    this.playAiTurn();
  }

  bullshit(){
    this.action.type = ActionType.bullshit;
    this.bullshittedBid = this.app.currentBid;
    this.action.playerWhoLostDie = this.app.bullshit();
    this.autoReroll();
  }

  autoReroll(){
    this.proposedBids = undefined;
    this.rerollInSec = 10;
    this.autoRerollCallback();
  }

  autoRerollCallback(){
    if(this.rerollInSec > 0 && this.bullshit){ 
      --this.rerollInSec;
      if(!this.rerollInSec) this.reroll();
      else 
        setTimeout(()=>{
          this.autoRerollCallback();
        }, 1000);
    }
  }

  reroll(){
    this.checkVictoryConditions();
    this.rerollInSec = 0;
    this.action = undefined;
    this.bullshittedBid = undefined;
    this.app.rerollDice();
    this.playAiTurn();
  }

  /**
   * First awaits the active player's roll
   * then continues to calculate possible bids and play AI turns if required
   */
  playAiTurn(){
    if(this.app.activePlayer.isRolling){
        setTimeout(() => {
            this.playAiTurn();
        }, 200);
    } else {
      this.proposedBids = this.app.possibleBids();
      if(this.app.activePlayer instanceof AiPlayer){
        let bid = this.app.currentBid;
        this.action = this.app.activePlayer.playTurn(this.app);
        if(!this.isBullshit) setTimeout(() => {this.playAiTurn()}, 3000);
        else{
          this.autoReroll();
          this.bullshittedBid = bid;
        }
      }
    }
  }

  checkVictoryConditions(){
    if(this.app.players.length == 1 && this.app.players[0] == this.player)
      this.victory.emit("You've successfully defeated the gamblers!");
    else if (this.app.players.indexOf(this.player) == -1)
      this.defeat.emit("Hint : if you pay attention to the mood of your opponents you can 'read' their dice");
  }
}
