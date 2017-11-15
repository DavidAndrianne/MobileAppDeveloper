import { Card } from "app/domain/hearthstone-emulator/card";
import { Hand } from "app/domain/hearthstone-emulator/hand";

export abstract class CreatureCard extends Card {
    currentHealth : number;
    maxHealth : number;
    attackDamage : number;
    attacksLeft : number;
    isInPlay : boolean;

    constructor(cost: number, name:string, description: string, imageUrl:string, maxHealth:number, attackDamage: number) {
        super(cost, name, description, imageUrl);
        this.attackDamage = attackDamage;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.attacksLeft = 0;
        this.isInPlay = false;
    }

    play(){
        this.isInPlay = true;
    }

    attack(target: CreatureCard){
        target.takeDamage(this.attackDamage);
        this.takeDamage(target.attackDamage);
        this.attacksLeft--;
    }

    /**
     * Takes a specified amount of damage
     * @param damage the damage to take, negative amounts will heal
     */
    takeDamage(damage:number){
        this.currentHealth -= damage;
    }

    readyForNewRound(){
        this.attacksLeft = 1;
    }
}

export class Baloe extends CreatureCard{
    constructor() {
        super(8, 
            "Baloe", 
            "Windfury. Curiosity might've killed the cat, but also brought it back, and it's hungry!",
            "baloe.jpg",
            8,
            8
        );
    }

    readyForNewRound(){
        this.attacksLeft = 2;
    }
}

export class Doge extends CreatureCard{
    constructor() {
        super(10, 
            "Doge", 
            "Charge. Such stone. Much hearth. Wow.",
            "doge.jpg",
            8,
            8
        );
    }

    play(){
        this.isInPlay = true;
        this.readyForNewRound();
    }
}