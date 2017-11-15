import { Actor } from "./actor";

export class Goal extends Actor {
    /**
     *
     */
    constructor(x: number, y:number) {
        super(x, y);
        this.spriteId = 10;
    }
}