import { Actor } from "./actor";

export class SnakePart extends Actor {
    direction: string;
    nextPart : SnakePart

    /**
     *
     */
    constructor(x: number, y:number, direction: string, nextPart? : SnakePart) {
        super(x, y);
        this.direction = direction;
        this.nextPart = nextPart;
    }

    move(){
        if(this.direction == "up") this.yPosition -= 1;
        if(this.direction == "down") this.yPosition += 1;
        if(this.direction == "left") this.xPosition -= 1;
        if(this.direction == "right") this.xPosition += 1;
        if(this.nextPart){
            this.nextPart.move();
            this.nextPart.direction = this.direction;
        }
    }
}

export class SnakeHead extends SnakePart {
    /**
     *
     */
    constructor(x: number, y:number, direction: string, nextPart : SnakePart) {
        super(x, y, direction, nextPart);
        this.spriteId = 1;
    }
}

export class SnakeBody extends SnakePart {
    /**
     *
     */
    constructor(x: number, y:number, direction: string, nextPart : SnakePart) {
        super(x, y, direction, nextPart);
        this.spriteId = 2;
    }
}

export class SnakeTail extends SnakePart {
    /**
     *
     */
    constructor(x: number, y:number, direction: string) {
        super(x, y, direction);
        this.spriteId = 3;
    }
}