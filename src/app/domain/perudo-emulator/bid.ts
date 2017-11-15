import { Player } from "app/domain/perudo-emulator/player";

export class Bid {
    value : number;
    quantity : number;
    get isPaco() : boolean{
        return this.value == 1;
    }

    constructor(value: number, quantity: number) {
        this.value = value;
        this.quantity = quantity;
    }

    raiseValue(valueToAdd:number) : number {
        if((this.value+valueToAdd) <= 6){
            this.value+=valueToAdd;
            return this.value;
        } else return undefined;
    }

    raiseQuantity(quantityToAdd:number, totalDice: number) : number {
        if((this.quantity+quantityToAdd) < totalDice){
            this.quantity+= quantityToAdd;
            return this.quantity;
        } else return undefined;
    }

    paco(totalDice: number) : number {
        if(!this.isPaco){
            this.value = 1;
            this.quantity = Math.ceil(this.quantity/2);
        } else return undefined;
    }

    /**
     * Courtesy of http://www.edcollins.com/backgammon/diceprob.htm
     */
    getChance(totalDice: number) : number{
        let totalResults = Math.pow(6, totalDice);
        let totalUndesiredResults = this.isPaco ? Math.pow(5, totalDice) : Math.pow(4, totalDice);
        return (totalResults-totalUndesiredResults)/totalResults / this.quantity;
    }

    getChanceForPlayer(totalDice: number, player: Player) : number{
        let modifiedTotalDice = totalDice - player.dice.length; // Remove required "chance dice" we know in the player's dicepool
        let modifiedQuantity = this.quantity // Reduce quantity which our own dice satisfying the case
                     - player.dice.filter(die => die.value == 1 || die.value == this.value).length;
        if(modifiedQuantity <= 0) return 1;
        return new Bid(this.value, modifiedQuantity).getChance(modifiedTotalDice);
    }
}