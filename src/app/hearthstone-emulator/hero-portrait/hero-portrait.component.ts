import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HeroCard } from 'app/domain/hearthstone-emulator/hero-card';
import { Player } from 'app/domain/hearthstone-emulator/player';
import { Hand } from 'app/domain/hearthstone-emulator/hand';
import { Card } from 'app/domain/hearthstone-emulator/card';

@Component({
  selector: 'hero-portrait',
  templateUrl: './hero-portrait.component.html',
  styleUrls: ['./hero-portrait.component.css']
})
export class HeroPortraitComponent implements OnInit {
  @Input()
  player : Player;
  @Input()
  cardBeingPlayed : Card;

  @Output()
  heroSelected = new EventEmitter<Card>();
  @Output()
  heroAbilitySelected = new EventEmitter<Card>();

  audioPlayer = new Audio();
  
  get hero(): HeroCard{
    return this.player.hero;
  }

  get hand(): Hand{
    return this.player.hand;
  }

  get mana(): any[]{
    let array = new Array(this.player.hand.maxMana);
    for(let index = 0; index < array.length; index++) {
      array[index] = this.player.hand.currentMana >= (index+1) ? 1 : 0;
    };
    return array;
  }

  message: string;

  constructor() { }

  ngOnInit() {
  }

  selectHero(){
    if(this.cardBeingPlayed != undefined) this.heroSelected.emit(this.hero);
    else {
      this.message = this.hero.speech;
      if(this.hero.speechAudioPath){
        this.audioPlayer.src = "/assets/hearthstone/"+this.hero.speechAudioPath;
        this.audioPlayer.load();
        this.audioPlayer.play();
      }
      setTimeout( () => {
        this.message = undefined;
      }, 2500);
    }
  }

  selectHeroAbility(){
    this.heroAbilitySelected.emit(this.hero.heroAbility);
  }

}
