import { Card } from "app/domain/hearthstone-emulator/card";
import { CreatureCard } from "app/domain/hearthstone-emulator/creature-card";

export abstract class SpellCard extends Card {
    isAoe = false;

    abstract play(targetEnemyRow: CreatureCard[], 
        targetEnemyHero?: CreatureCard, 
        targetFriendlyRow?: CreatureCard[], 
        targetFriendlyHero?: CreatureCard)
}

export class Flamestrike extends SpellCard {
    damage = 100;

    constructor() {
        super(7, 
            "Flamestrike", 
            "Deals 100 damage to all enemy minions on the board. \"F* your shit.\"",
            "flamestrike.jpg");
            this.isAoe = true;
    }

    play(targetEnemyRow: CreatureCard[],
        targetEnemyHero?: CreatureCard, 
        targetFriendlyRow?: CreatureCard[], 
        targetFriendlyHero?: CreatureCard){
        targetEnemyRow.forEach(target => target.takeDamage(this.damage));
        return targetEnemyRow;
    }
}