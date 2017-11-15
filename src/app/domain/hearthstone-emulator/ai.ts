import { Card } from "app/domain/hearthstone-emulator/card";
import { CreatureCard } from "app/domain/hearthstone-emulator/creature-card";

export class AiAction {
    cardPlayed : Card;
    targets: CreatureCard[];

    /**
     * Creates an instance of an AiAction specifying the card that was played and on which targets
     */
    constructor(cardPlayed : Card, targets: CreatureCard[]) {
        this.cardPlayed = cardPlayed;
        this.targets = targets;
    }
}