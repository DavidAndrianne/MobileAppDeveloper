import { PerudoGame } from "app/domain/perudo-emulator/perudo-game";
import { Bid } from "app/domain/perudo-emulator/bid";
import { Player } from "app/domain/perudo-emulator/player";

/**
 * Workaround attempt #2 at creating an enumlike "static class" 
 * with strings as returned values
 */
export class ActionType{
    static get openingBid() : string { return "opening bid"; }
    static get raiseValue() : string { return "value"; }
    static get raiseQuantity() : string { return "quantity"; }
    static get paco() : string { return "paco"; }
    
    static get bullshit() : string { return "bullshit"; }
    static get unknown() : string { return "unknown"; }
}

export class AiAction{
    type : string;
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