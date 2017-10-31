import { MobileAppCloneCounter } from "app/domain/mobile-app-clone-counter";

export class ProgressionTracker{
    keyboardUpgradeLevel? : number = 0;
    addsUpgradeLevel? : number = 0;
    contractUpgradeLevel? : number = 0;
    shortcutUpgradeLevel? : number = 0;
    developpedApps? : MobileAppCloneCounter[] = [];
}