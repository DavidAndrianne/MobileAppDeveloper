import { Hand } from "app/domain/hearthstone-emulator/hand";
import { HeroCard } from "app/domain/hearthstone-emulator/hero-card";
import { CreatureCard } from "app/domain/hearthstone-emulator/creature-card";
import { Card } from "app/domain/hearthstone-emulator/card";
import { SpellCard } from "app/domain/hearthstone-emulator/spell-card";
import { AiAction } from "app/domain/hearthstone-emulator/ai";

export class Player {
    hand : Hand;
    creatureRow : CreatureCard[];
    hero : HeroCard;

    constructor(hero: HeroCard, creatureRow?: CreatureCard[]) {
        if(!creatureRow) creatureRow = [];
        this.hero = hero;
        this.hand = new Hand();
        this.creatureRow = creatureRow;
    }
}

export class AiPlayer extends Player {
    playTurn(opponent:Player) : AiAction[]{
        let aiActions = [];
        let action = this.selectCardToPlay(opponent);
        while(action){
            let targets : CreatureCard[];
            if(action instanceof SpellCard && action.isAoe)
                targets = this.hand.playAoe(action, opponent.creatureRow, opponent.hero, this.creatureRow, this.hero);
            else if(action instanceof CreatureCard && !action.isInPlay){
                this.creatureRow.push(this.hand.play(action));
                targets = [];
            }
            else {
                targets = [this.selectTarget(opponent)];
                if(targets[0] == undefined) return aiActions;
                this.hand.play(action, targets);
            }
            aiActions.push(new AiAction(action, targets));
            action = this.selectCardToPlay(opponent);
        }
        return aiActions;
    }

    selectTarget(opponent:Player) : CreatureCard{
        let possibleTargets = opponent.creatureRow.concat(opponent.hero)
                                                  .filter(target => target.currentHealth > 0);
        let cardIndex = Math.floor(Math.random()*possibleTargets.length);
        console.log("selected target", possibleTargets[cardIndex]);
        return possibleTargets[cardIndex];
    }

    selectCardToPlay(opponent:Player) : Card{
        let possibleSpells = this.hand.cards.concat(this.hero.heroAbility)
                                            .filter(spell => spell.cost <= this.hand.currentMana)
        let possibleAttacks = this.creatureRow.concat(this.hero)
                                              .filter(creature => creature.attacksLeft && creature.attackDamage);
        let possibleActions = possibleSpells.concat(possibleAttacks);
        if(possibleActions.length == 0) return undefined;
        let cardIndex = Math.floor(Math.random()*possibleActions.length);
        console.log("selected action", possibleActions[cardIndex]);
        return possibleActions[cardIndex];
    }
}