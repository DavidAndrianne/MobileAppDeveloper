import { Die } from "app/domain/perudo-emulator/die";
import { PerudoGame } from "app/domain/perudo-emulator/perudo-game";
import { AiAction } from "app/domain/perudo-emulator/ai";

export class Player {
    dice : Die[];
    isRolling = false;
    audio = new Audio();

    /**
     * Initializes a new player
     * @param diceCount the amount of dice that should be granted to this player
     */
    constructor(diceCount:number) {
        this.dice = [];
        for(let j = 0; j < diceCount; j++){
            this.dice.push(new Die());
        }
        this.reroll();
    }

    /**
     * Rolls player's entire dice pool
     */
    reroll(){
        this.isRolling = true;
        this.dice.forEach(die => die.roll());
        setTimeout(() => {
            this.isRolling = false;
        }, this.dice[0].rollTime);

        let sound = Math.random();
        let soundfile = undefined;
        if(sound >= 0.9)
            soundfile = "/assets/perudo/roll_redneck.mp3";
        else
            soundfile = "/assets/perudo/roll.mp3";
        if(soundfile){
            this.audio.src = soundfile;
            this.audio.load();
            this.audio.play();
        }
    }

    /**
     * Removes a die of a player's dice pool
     */
    loseDie(){
        this.dice.splice(-1, 1);
    }
}

export class AiPlayer extends Player {
    name: string;
    get mood(): string {
        if(this.confidence >= 0.20)
            return "Confident";
        else if (this.confidence >= 0.10)
            return "Sure";
        else if (this.confidence >= 0.00)
            return "Neutral"
        else if (this.confidence >= -0.10)
            return "Doubtful";
        else if (this.confidence < -0.10)
            return "Shaky";
    }
    confidence: number;

    constructor(diceCount: number) {
        super(diceCount);
        let names = ["Billy the kid", "Vulture Sam", "King Julian", "Molly Stark", "Tomas Sturdik", "Jourdonnais", "Lucky Duke", "Apache Kid", "Jose Delgado", "Slab the Killer"];
        this.name = names[Math.floor(Math.random()*names.length)];
        this.rerollConfidence();
    }

    playTurn(game : PerudoGame) : AiAction{
        let chance = game.getChanceForPlayer(this);
        this.rerollConfidence(chance);
        let confidence = chance+this.confidence;
        if(!game.currentBid || confidence >= 0.5){
            // Confident, raise the bid
            let bids = game.possibleBids();
            let previousBid = game.currentBid;
            game.raiseBid(bids[Math.floor(Math.random()*bids.length)]);
            return new AiAction(game, previousBid == undefined, previousBid);
        } else {
            // Not confident, bullshit the bid
            let playerWhoLostDie = game.bullshit();
            let action = new AiAction(game, false);
            action.playerWhoLostDie = playerWhoLostDie;
            return action;
        }
    }

    /**
     * Rolls player's entire dice pool
     * AI : reroll confidence
     */
    reroll(){
        this.isRolling = true;
        this.dice.forEach(die => die.roll());
        setTimeout(() => {
            this.isRolling = false;
        }, this.dice[0].rollTime);
        this.rerollConfidence();
    }

    rerollConfidence(modifier?: number){
        let base = Math.random()/2;
        if(modifier) base *= modifier;
        this.confidence = (this.name == "Tomas Sturdik") ? base -0.45 : base-0.25;
    }
}