import { Card } from "app/domain/hearthstone-emulator/card";
import { CreatureCard } from "app/domain/hearthstone-emulator/creature-card";
import { SpellCard } from "app/domain/hearthstone-emulator/spell-card";
import { HeroCard } from "app/domain/hearthstone-emulator/hero-card";
import { HeroAbilityCard } from "app/domain/hearthstone-emulator/hero-ability-card";

export class Hand {
    cards : Card[];
    currentMana : number = 10;
    maxMana : number = 10;

    constructor() {
        this.cards = [];
        this.currentMana = this.maxMana;
    }

    play(card:Card, targets?: Card[], costModifier?:number){
        if(card instanceof CreatureCard && card.isInPlay){
            card.attack(<CreatureCard>targets[0]);
            return card;
        } else {
            // pay mana cost
            if(this.payCost(card.cost, costModifier)){
                if(card instanceof HeroAbilityCard) card.play(<CreatureCard[]>targets);
                else {
                    // verify this card is in our hand, then play and discard it
                    this.cards.find(cardI => cardI == card).play(targets);
                    this.discardCard(card);
                }

                // if creature, return card so it may be added to our creature row
                if(card instanceof CreatureCard) return card;
            }
        }
    }

    playAoe(card:SpellCard, enemyMonsters: CreatureCard[], enemyHero: HeroCard, friendlyMonsters: CreatureCard[], friendlyHero: HeroCard, costModifier?:number) : CreatureCard[]{
        // pay mana cost
        if(this.payCost(card.cost, costModifier) && this.cards.indexOf(card) > -1){
            let targets = card.play(enemyMonsters, enemyHero, friendlyMonsters, friendlyHero);
            this.discardCard(card);
            return targets;
        }
    }

    payCost(cost: number, modifier: number){
        if(!modifier) modifier = 0;
        if(this.currentMana >= (cost+modifier)){
            this.currentMana -= (cost+modifier);
            return true;
        }
        return false;
    }

    drawCard(card:Card){ 
        this.cards.push(card);
    }
    discardCard(card:Card){ 
        this.cards.splice(this.cards.indexOf(card), 1);
    }
}