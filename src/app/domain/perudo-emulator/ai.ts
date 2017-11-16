import { PerudoGame } from "app/domain/perudo-emulator/perudo-game";
import { Bid } from "app/domain/perudo-emulator/bid";
import { Player } from "app/domain/perudo-emulator/player";

/**
 * Workaround to having an enum/static class that returns strings
 * https://stackoverflow.com/questions/13212521/typescript-static-classes
 */
export namespace ActionType{
    export function openingBid() : string { return "opening bid"; }
    export function raiseValue() : string { return "value"; }
    export function raiseQuantity() : string { return "quantity"; }
    export function paco() : string { return "paco"; }
    
    export function bullshit() : string { return "bullshit"; }
    export function unknown() : string { return "unknown"; }
}

export class AiAction{
    type : string;
    playerWhoLostDie: Player;

    /**
     * Deduces the aiAction taken based of the game and the accepted bid
     */
    constructor(game: PerudoGame, isOpeningBid: boolean, acceptedBid?: Bid) {
        if(isOpeningBid) this.type = ActionType.openingBid();
        else if(!acceptedBid) this.type = ActionType.bullshit();
        else if(game.currentBid.value > acceptedBid.value) this.type = ActionType.raiseValue();
        else if(game.currentBid.quantity > acceptedBid.quantity) this.type = ActionType.raiseQuantity();
        else if(game.currentBid.isPaco) this.type = ActionType.paco();
        else this.type = ActionType.unknown();
    }
}