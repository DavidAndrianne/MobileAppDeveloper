export class Actor {
    xPosition : number;
    yPosition : number;
    spriteId : number;

    /**
     *
     */
    constructor(x: number, y:number) {
        this.xPosition = x;
        this.yPosition = y;
    }

    collidesWith(other: Actor) : boolean{
        return other.xPosition == this.xPosition && other.yPosition == this.yPosition;
    }
}