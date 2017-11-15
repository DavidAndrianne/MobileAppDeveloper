import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CreatureCard } from 'app/domain/hearthstone-emulator/creature-card';
import { Card } from 'app/domain/hearthstone-emulator/card';

@Component({
  selector: 'monsterlane',
  templateUrl: './monsterlane.component.html',
  styleUrls: ['./monsterlane.component.css']
})
export class MonsterlaneComponent implements OnInit {
  @Input()
  monsters : CreatureCard[];
  @Input()
  cardBeingPlayed : Card;
  @Input()
  creaturesPlaceable : boolean;
  
  @Output()
  placeCreature = new EventEmitter<number>();
  @Output()
  creatureSelected = new EventEmitter<CreatureCard>();

  get creatureBeingPlayed() : boolean{
    return this.cardBeingPlayed instanceof CreatureCard && this.creaturesPlaceable && !this.cardBeingPlayed.isInPlay;
  }
  constructor() { }

  ngOnInit() {
  }

  selectCreaturePlace(i:number){
    this.placeCreature.emit(i);
  }

  selectCreature(creature:CreatureCard){
    this.creatureSelected.emit(creature);
  }

}
