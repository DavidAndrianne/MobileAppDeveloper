export class Upgrade {
    name: string;
    tier: number;
    cost: number;

    title: string;
    imageUrl: string;
    
    isUnlocked?: boolean = false;
    isBought?: boolean = false;
}