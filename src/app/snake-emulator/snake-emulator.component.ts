import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { SnakeHead, SnakeBody, SnakeTail, SnakePart } from '../domain/snake-emulator/snake';
import { Goal } from '../domain/snake-emulator/goal';
import { Actor } from '../domain/snake-emulator/actor';

@Component({
  selector: 'snake-emulator',
  templateUrl: './snake-emulator.component.html',
  styleUrls: ['./snake-emulator.component.css']
})
export class SnakeEmulatorComponent implements OnInit {
  isGameRunning = false;
  @Output()
  victory = new EventEmitter<string>();

  @Output()
  defeat = new EventEmitter<string>();
  
  // board setup
  context: CanvasRenderingContext2D;
  maxWidth : number;
  maxHeight: number;
  actors = <Actor[]>[];
  scale = 4;
  timeOut = 400;

  constructor() { }

  ngOnInit() {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    if (canvas.getContext("2d")) {      
      this.context = canvas.getContext('2d');
      this.maxWidth = this.context.canvas.width/this.scale;
      this.maxHeight = this.context.canvas.height/this.scale;
      let goalX = Math.ceil(Math.random()*(this.maxWidth-15))+10;
      let goalY = Math.ceil(Math.random()*(this.maxHeight-15))+10;
      let snake = new SnakeHead(5, 6, "right", 
        new SnakeBody(5, 5, "down", 
          new SnakeBody(4, 5, "right",
            new SnakeTail(4, 4, "down")
            )
          )
        );
      this.actors = [
        new Goal(goalX, goalY),
        snake,
        snake.nextPart,
        snake.nextPart.nextPart,
        snake.nextPart.nextPart.nextPart
      ];

      this.drawBoard();
      this.context.fillStyle = "#FFF";
      this.context.fillText("Use the arrow keys to move", this.maxWidth/4, this.maxHeight/1.1);
      this.context.fillText("Press space to start...", this.maxWidth/4, this.maxHeight/2);
    } else console.error("Snake canvas could not be loaded!");
  }

  get snakeHead() : SnakeHead {
    return <SnakeHead>this.actors.find(actor => actor instanceof SnakeHead);
  }

  moveSnake(){
    this.snakeHead.move();
    this.drawBoard();
    
    let isLost = this.snakeHead.xPosition < 0 || this.snakeHead.yPosition < 0;
    let isWon = this.snakeHead.collidesWith(this.actors.find(actor => actor instanceof Goal));
    if(isWon) this.victory.emit("You won Snake!");
    
    let snake = this.actors.filter(actor => actor instanceof SnakePart);
    snake.forEach(part => {
      snake.forEach(otherPart => {
        if(part != otherPart && part.collidesWith(otherPart))
          isLost = true;
      });
    });
    if(isLost) this.defeat.emit("DEAD: Don't run into yourself or the edge of the map!");

    if(!isLost && !isWon){ 
      setTimeout(() => {
        if(this.timeOut > 100) this.timeOut*=0.95;
        this.moveSnake();
      }, this.timeOut);
    } else this.isGameRunning = false;
  }

  drawBoard(){
    this.resetBoard();
    for(let i = 0; i < this.actors.length; i++){
      let actorToDraw = this.actors[i];
      if(actorToDraw instanceof SnakeHead) this.drawSnakeHead(actorToDraw);
      else if(actorToDraw instanceof SnakeBody) this.drawSnakeBody(actorToDraw);
      else if(actorToDraw instanceof SnakeTail) this.drawSnakeTail(actorToDraw);
      else if(actorToDraw instanceof Goal) this.drawGoal(actorToDraw);
      else console.error("ERROR", "expected instance of snake or goal but got :", actorToDraw);
    }
  }

  resetBoard()
  {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }

  drawSnakeTail(snakeTail: SnakeTail){
    this.context.fillStyle = '#999';
    this.context.fillRect(snakeTail.xPosition*this.scale, snakeTail.yPosition*this.scale, this.scale, this.scale);
  }

  drawSnakeBody(snakeBody: SnakeBody){
    this.context.fillStyle = '#CCC';
    this.context.fillRect(snakeBody.xPosition*this.scale, snakeBody.yPosition*this.scale, this.scale, this.scale);
  }

  drawSnakeHead(snakeHead: SnakeHead){
    this.context.fillStyle = '#FFF';
    this.context.fillRect(snakeHead.xPosition*this.scale, snakeHead.yPosition*this.scale, this.scale, this.scale);
  }

  drawGoal(goal: Goal){
    this.context.fillStyle = '#F00';
    this.context.fillRect(goal.xPosition*this.scale, goal.yPosition*this.scale, this.scale, this.scale);
  }

  @HostListener('document:keyup', ['$event'])
  input(event : KeyboardEvent){
    if(event.keyCode == 32 && !this.isGameRunning){ // spacebar
      this.isGameRunning = true;
      this.moveSnake();
    }
    if(event.keyCode >= 38 && event.keyCode <= 40) event.preventDefault(); // don't allow scrolling
    if(event.keyCode == 38) this.snakeHead.direction = "up";
    if(event.keyCode == 40) this.snakeHead.direction = "down";
    if(event.keyCode == 37) this.snakeHead.direction = "left";
    if(event.keyCode == 39) this.snakeHead.direction = "right";
  }
}
