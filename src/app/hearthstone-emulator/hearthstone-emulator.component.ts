import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Player, AiPlayer } from 'app/domain/hearthstone-emulator/player';
import { Card } from 'app/domain/hearthstone-emulator/card';
import { Hand } from 'app/domain/hearthstone-emulator/hand';
import { Lorenzo, Milanello, HeroCard } from 'app/domain/hearthstone-emulator/hero-card';
import { Flamestrike, SpellCard } from 'app/domain/hearthstone-emulator/spell-card';
import { Doge, Baloe, CreatureCard } from 'app/domain/hearthstone-emulator/creature-card';
import { AiAction } from 'app/domain/hearthstone-emulator/ai';

@Component({
  selector: 'hearthstone-emulator',
  templateUrl: './hearthstone-emulator.component.html',
  styleUrls: ['./hearthstone-emulator.component.css']
})
export class HearthstoneEmulatorComponent implements OnInit {
  audio = new Audio();

  @Output()
  victory = new EventEmitter<string>();

  @Output()
  defeat = new EventEmitter<string>();

  get tournamentCards() : Card[]{
    return [new Flamestrike(), new Baloe(), new Doge()];
  }
  opponent : Player;
  player : Player;
  currentPlayer : Player;
  actions : AiAction[];
  autoCompleteSecondsRemaining: number;
  get opposingPlayer() : Player { return (this.player == this.currentPlayer) ? this.opponent : this.player; } 
  cardBeingPlayed : Card;

  constructor() { }

  ngOnInit() {
    // Setup player
    this.player = new Player(new Lorenzo());
    this.player.hero.currentHealth = 5;
    this.currentPlayer = this.player;
    for(let i = 0; i < 3; i++) this.drawRandomCard();

    // Setup opponent
    this.opponent = new AiPlayer(new Milanello());
    this.opponent.hero.currentHealth = 5;
    this.opponent.hand.currentMana = 1;
    this.currentPlayer = this.opponent;
    for(let i = 0; i < 3; i++) this.drawRandomCard();

    // Queue background theme
    this.audio.src = "/assets/hearthstone/hearthstone-theme.mp3";
    this.audio.load();
    this.audio.play();
    this.startNewRound();
  }

  activateCard(card: Card){
    console.log("hearthstone-emulator - ", "card activated:", card);

    // Check if we're a creature attacking another creature
    if(this.cardBeingPlayed != undefined && this.cardBeingPlayed instanceof CreatureCard 
      && this.cardBeingPlayed.isInPlay)
    {
      if(card instanceof CreatureCard && card != this.cardBeingPlayed)
        this.playCard(this.cardBeingPlayed, [card]);
      return undefined;
    }

    // Check if we can afford this card
    if( (this.cardBeingPlayed == undefined && card.cost > this.currentPlayer.hand.currentMana  
      && (card instanceof CreatureCard && !card.isInPlay || ! (card instanceof CreatureCard)))
      || (this.cardBeingPlayed != undefined && this.cardBeingPlayed.cost > this.currentPlayer.hand.currentMana))
        return undefined;

    if(this.cardBeingPlayed == undefined){
      if(card instanceof HeroCard) return undefined; // Abort! You can't play a hero! 
      if(card instanceof CreatureCard && card.isInPlay && !card.attacksLeft) return undefined; // No attacks, ignored
      if(card instanceof SpellCard && card.isAoe) this.playCard(card); // Activate immediately
      else {
        this.cardBeingPlayed = card;
        this.cardBeingPlayed.isFlash = true;
        setTimeout(() => card.isFlash = false, 2000);
      }
    }
    else
      if(card != this.cardBeingPlayed
        && card instanceof CreatureCard 
        && card.isInPlay){ // Prevent from attacking/buffing creatures in hand
        this.playCard(this.cardBeingPlayed, [card]);
      }
  }

  addCreatureToHand(index:number){
    if(this.cardBeingPlayed instanceof CreatureCard){
      let creature = this.currentPlayer.hand.play(this.cardBeingPlayed);
      this.currentPlayer.creatureRow.splice(index, 0, creature);
      this.cardBeingPlayed = undefined;
      this.evaluateBoard();
    }
  }

  playCard(cardBeingPlayed:Card, target?:Card[]){
    if(cardBeingPlayed instanceof SpellCard && cardBeingPlayed.isAoe)
      this.currentPlayer.hand.playAoe(cardBeingPlayed, this.opponent.creatureRow, this.opponent.hero, this.currentPlayer.creatureRow, this.currentPlayer.hero)
    else
      this.currentPlayer.hand.play(cardBeingPlayed, target);
    this.cardBeingPlayed = undefined;
    this.evaluateBoard();
  }

  evaluateBoard(){
    // Remove dead creatures
    [this.player.creatureRow, this.opponent.creatureRow].forEach(creatureRow => {
      creatureRow.forEach(card => {
          if(card.currentHealth <= 0) // if dead 
            creatureRow.splice(creatureRow.indexOf(card), 1); // remove creature 
      })
    });

    // Verify if either player is dead
    if(this.opponent.hero.currentHealth <= 0){
      this.victory.emit("You've defeated "+this.opponent.hero.name+" with " + this.player.hero.currentHealth+" hp remaining!");
      this.audio.pause();
    }
    else if (this.player.hero.currentHealth <= 0){
      this.defeat.emit("Read the cards carefully and make a wiser decision next time!");
      this.audio.pause();
    }
  }

  /**
   * Switches turn to the next player
   * Resets mana to max
   * Grants 1 attack to each summoned creature
   * Draws random card into hand
   * If it's the AI player's turn, then activates the AI player
   */
  startNewRound(){
    this.currentPlayer = (this.player == this.currentPlayer) ? this.opponent : this.player;
    
    this.currentPlayer.hand.currentMana = this.currentPlayer.hand.maxMana;
    this.currentPlayer.creatureRow.concat(this.currentPlayer.hero)
        .forEach(creature => creature.readyForNewRound());
    this.drawRandomCard();

    if(this.currentPlayer instanceof AiPlayer){
      this.actions = this.currentPlayer.playTurn(this.opposingPlayer);
      this.autoCompleteSecondsRemaining = 30;
      let tickHandle = () => {
        if(this.actions){
          this.autoCompleteSecondsRemaining--;
          console.log("autocomplete AI turn seconds:", this.autoCompleteSecondsRemaining);
          if(!this.autoCompleteSecondsRemaining){
            this.endAiTurn();
          } else {
            setTimeout(tickHandle, 1000);
          }
        }
      };
      setTimeout(tickHandle, 1000);
    }
  }

  endAiTurn(){
    this.actions = undefined;
    this.evaluateBoard();
    this.startNewRound();
  }

  drawRandomCard(){
    let cardToDraw = this.shuffle(this.tournamentCards)[0];
    this.currentPlayer.hand.drawCard(cardToDraw);
  }

  /**
   * Randomizes an array with performance O(n)
   * Fisher–Yates shuffle algorythm
   * Source : https://bost.ocks.org/mike/shuffle/ 
   * @param array 
   */
  shuffle(array) : any[] {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }

}
