import { Hand } from "app/domain/hearthstone-emulator/hand";
import { CreatureCard } from "app/domain/hearthstone-emulator/creature-card";
import { HeroAbilityCard, JuventusSpirit, MilanellosKick } from "app/domain/hearthstone-emulator/hero-ability-card";

export abstract class HeroCard extends CreatureCard {
    heroAbility : HeroAbilityCard;
    speech : string;
    speechAudioPath : string;

    constructor(name:string, description: string, heroAbility: HeroAbilityCard, imageUrl: string, speech: string, speechAudioPath: string) {
        super(0, name, description, imageUrl, 30, 0);
        this.heroAbility = heroAbility;
        this.speech = speech;
        this.speechAudioPath = speechAudioPath;
        this.isInPlay = true;
    }
}

export class Lorenzo extends HeroCard {
    constructor() {
        super("Zorbo", "Viva juventus!", new JuventusSpirit(), "zorbo.png", "I wana fowk on ti tabel!", "fork-on-table.mp3");
    }
}

export class Milanello extends HeroCard {
    constructor() {
        super("Milanello", "Viva Milan!", new MilanellosKick(), "milanello.png", "I wana shiet on mah behd", "sheat-on-bed.mp3");
    }
}