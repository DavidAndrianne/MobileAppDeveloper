import { Hand } from "app/domain/hearthstone-emulator/hand";
  
export abstract class Card {
    name: string;
    description: string;
    cost: number;
    imageUrl? : string;
    
    isFlash? = false; // used by animation

    constructor(cost: number, name:string, description: string, imageUrl? : string) {
        this.cost = cost;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    abstract play(target?:Card[]);
}