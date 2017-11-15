export class Die {
    value : number;
    maximumRerollMs = 300;
    rerollIntervalMs = 50;
    get rollTime() : number{
        let time = 0;
        let maxMs = this.maximumRerollMs;
        while(maxMs > 0){
            maxMs -= this.rerollIntervalMs;
            time += this.maximumRerollMs - maxMs;
        }
        return time;
    }
    isRolling = false;
    
    roll(){
        let timeout = this.maximumRerollMs;
        this.isRolling = true;
        let callback = () => {
            this.reroll();
            timeout -= this.rerollIntervalMs;
            if(timeout)
                setTimeout(callback, this.maximumRerollMs - timeout)
            else
                this.isRolling = false;
        };
        callback();
    }

    reroll(){
        this.value = Math.ceil(Math.random()*6);
    }
}