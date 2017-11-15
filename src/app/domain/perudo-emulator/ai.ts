import { PerudoGame } from "app/domain/perudo-emulator/perudo-game";
import { Bid } from "app/domain/perudo-emulator/bid";
import { Player } from "app/domain/perudo-emulator/player";

export enum ActionType{
    openingBid = "openingBid",
    raiseValue = "value",
    raiseQuantity = "quantity",
    paco = "paco",

    bullshit = "bullshit",
    unknown = "unknown"
}

export class AiAction{
    type: ActionType;
    playerWhoLostDie: Player;

    /**
     * Deduces the aiAction taken based of the game and the accepted bid
     */
    constructor(game: PerudoGame, isOpeningBid: boolean, acceptedBid?: Bid) {
        if(isOpeningBid) this.type = ActionType.openingBid;
        else if(!acceptedBid) this.type = ActionType.bullshit;
        else if(game.currentBid.value > acceptedBid.value) this.type = ActionType.raiseValue;
        else if(game.currentBid.quantity > acceptedBid.quantity) this.type = ActionType.raiseQuantity;
        else if(game.currentBid.isPaco) this.type = ActionType.paco;
        else this.type = ActionType.unknown;
    }
}