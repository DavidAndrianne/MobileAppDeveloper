import { Player, AiPlayer } from "app/domain/perudo-emulator/player";
import { Die } from "app/domain/perudo-emulator/die";
import { Bid } from "app/domain/perudo-emulator/bid";

export class PerudoGame{
    players : Player[];
    previousPlayer : Player;
    activePlayer : Player;
    currentBid : Bid;
    get totalDice() : Die[]{
        let dice = [];
        for(let i = 0; i < this.players.length; i++)
            dice = dice.concat(this.players[i].dice);
        return dice;
    }
    get totalDiceCount() : number{ return this.totalDice.length; }

    constructor(playerCount: number, diceCount: number) {
        this.players = [new Player(diceCount)];
        for(let i = 1; i < playerCount; i++)
            this.players.push(new AiPlayer(diceCount));
        this.activePlayer = this.players[this.randomize(this.players.length)];
    }

    /**
     * Returns 3 possible suggested bids
     * 1. Raising the value
     * 2. Raising the quantity
     * 3. Pacoing the bid
     * Note : if this is the opening bid, 3 random bids will be generated
     */
    possibleBids() : Bid[]{
        let bids = [];
        if(this.currentBid == undefined){
            for(let i = 0; i < 3; i++)
                bids.push(
                    new Bid( this.randomize(6, 2), this.randomize(this.totalDiceCount/2, 1) )
                );
        } else {
            if(!this.currentBid.isPaco && this.currentBid.value < 6)
                bids.push(new Bid(this.currentBid.value+1, this.currentBid.quantity));
            else if (this.currentBid.isPaco)
                bids.push(new Bid(this.randomize(6, 2), this.currentBid.quantity*2+1));
            if(this.currentBid.quantity < this.totalDiceCount)
                bids.push(new Bid(this.currentBid.value, this.currentBid.quantity+1));
            if(!this.currentBid.isPaco)
                bids.push(new Bid(1, Math.ceil(this.currentBid.quantity/2)))
        }
        return bids;
    }

    /**
     * Sets the new bid or raises the current bid
     * @param newBid the new current bid
     */
    raiseBid(newBid: Bid){
        this.currentBid = newBid;
        this.nextPlayer();
    }

    /**
     * Verifies if the currentBid holds true or not
     * then resolves conflict by removing a die of the player who's "wrong"
     */
    bullshit() : Player{
        let playerWhoLostDie : Player;
        let totalCount = 
            this.totalDice.filter(die => die.value == this.currentBid.value || die.value == 1)
                          .length;
        
        if(totalCount >= this.currentBid.quantity){
            // not bullshit, active player loses a die
            this.activePlayer.loseDie();
            playerWhoLostDie = this.activePlayer;
            if(!this.activePlayer.dice.length)
                // active player is being removed from the game, skipping to next player for opening bid
                this.nextPlayer();
        } else {
            // bullshit, previous player loses a die
            this.previousPlayer.loseDie();
            playerWhoLostDie = this.previousPlayer;
            if(this.previousPlayer.dice.length)
                this.activePlayer = this.previousPlayer;
        }
        if(playerWhoLostDie.dice.length == 0) this.eliminatePlayer(playerWhoLostDie);
        this.previousPlayer = undefined;
        this.currentBid = undefined;
        return playerWhoLostDie;
    }

    /**
     * Rerolls the dice of all players
     */
    rerollDice(){
        this.players.forEach(player => player.reroll());
    }

    /**
     * Switches to the next active player
     */
    nextPlayer(){
        this.previousPlayer = this.activePlayer;
        let indexActivePlayer = this.players.indexOf(this.activePlayer);
        indexActivePlayer++;
        if(indexActivePlayer == this.players.length) indexActivePlayer = 0;
        this.activePlayer = this.players[indexActivePlayer];
    }

    /**
     * Called when player has no more dice and is to be eliminated
     * @param player player to eliminate
     */
    eliminatePlayer(player : Player){
        this.players.splice(this.players.indexOf(player), 1);
    }

    /**
     * Gets the chance for the current bid to hold true without knowing any dice
     */
    getBlindChance(){
        if(!this.currentBid) return undefined; 
        return this.currentBid.getChance(this.totalDiceCount); 
    }

    /**
     * Gets the chance for the current bid to hold true knowing the dice of a specified player
     * @param player the player's dice to use for calculating the chance
     * @param bid the player's potential bid to use instead of the current bid
     */
    getChanceForPlayer(player:Player, bid?:Bid){
        let bidToCalculate = (bid) ? bid : this.currentBid;
        if(!bidToCalculate) return undefined;
        return bidToCalculate.getChanceForPlayer(this.totalDiceCount, player);
    }

    /**
     * Helper function to random a number from 0 unless a minTarget was specified
     * @param maxTarget maximum number value
     * @param minTarget (optional) the minimum number value
     */
    randomize(maxTarget :number, minTarget?: number){ 
        if(minTarget) maxTarget -= minTarget;
        let number = Math.floor(Math.random()*maxTarget);
        if(minTarget) number += minTarget;
        return number;
    }
}