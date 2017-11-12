import { SpellCard } from "app/domain/hearthstone-emulator/spell-card";
import { CreatureCard } from "app/domain/hearthstone-emulator/creature-card";

export abstract class HeroAbilityCard extends SpellCard {
}

export class JuventusSpirit extends HeroAbilityCard {
    constructor() {
        super(2, 
            "Juventus' spirit", 
            "Invokes the spirit of a juventus supporter to encourage someone into making someone else go ba-da-bee ba-da-boom",
            "juventus-spirit.png");
    }

    play(targets: CreatureCard[]) {
        targets.forEach(target => target.attackDamage += 5);
    }
}

export class MilanellosKick extends HeroAbilityCard {
    constructor() {
        super(2, 
            "Milanello's kick", 
            "Milanello want to /kick/ on /the/ head! Deals 5 damage to the enemy hero.",
            "milanellos-kick.png");
    }

    play(targets: CreatureCard[]) {
        targets.forEach(target => target.takeDamage(5));
    }
}