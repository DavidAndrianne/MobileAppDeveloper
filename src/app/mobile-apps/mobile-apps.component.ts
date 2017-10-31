import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MobileApp } from "app/domain/mobile-app";
import { ProgressionTracker } from 'app/domain/progression-tracker';
@Component({
  selector: 'mobile-apps',
  templateUrl: './mobile-apps.component.html',
  styleUrls: ['./mobile-apps.component.css']
})
export class MobileAppsComponent implements OnInit {
  apps = [<MobileApp>{name: 'Snake', thumbnailUrl:'Snake.png', income: 1, cost: 20},
  <MobileApp>{name: 'Hearthstone', thumbnailUrl:'Hearthstone.jpg', income: 11, cost: 200},
  <MobileApp>{name: 'Perudo', thumbnailUrl:'perudo.png', income: 58, cost: 1000}];

  @Input()
  progressionTracker : ProgressionTracker;
  
  @Input() developerIncome: number;
  @Output() getIncomeChange = new EventEmitter<MobileApp>();

  constructor() { }
  
  ngOnInit() {
      this.apps[0].isUnlocked = true;
  }
  
  develop(app) {
    console.log("developed app : "+ app.name);
    // Unlock next app (if there is one)
    if(this.apps[this.apps.indexOf(app)+1]) this.apps[this.apps.indexOf(app)+1].isUnlocked = true;
    this.codePower -= app.cost; // reduce dev power
    this.getIncomeChange.emit(app); // get income
  }
  
  // Fired when a user types any key on the page
  // Will show 3 random chars from a pre-defined code sample and gives the developer a choice to release
  // it as a mobileApp
  @HostListener('document:keyup', ['$event'])
  writeCode(event : KeyboardEvent) {
console.log("mobile-apps-component", "writecode key:", event);

    // Add "code power" (lines of code written to turn into an app)
    let power = 1;
    if(this.progressionTracker.keyboardUpgradeLevel >= 1) power*=2;
    if(this.progressionTracker.keyboardUpgradeLevel >= 2) power*=2;
    if(this.progressionTracker.keyboardUpgradeLevel >= 3) power*=2;
    this.codePower+=power;

    // Generate code in the console
    if(this.codeToShow == undefined || this.codeToShow.length == 0 || this.codeToShow.length+this.codeChars > this.sourceCode.length)
      this.codeToShow = this.sourceCode.substr(0, this.codeChars);
    else
      if(this.codeToShow.length+this.codeChars < this.sourceCode.length)
        this.codeToShow += this.sourceCode.substr(this.sourceCode.indexOf(this.codeToShow)+this.codeToShow.length, this.codeChars);
    if(this.codeToShow.length > 300)
        this.codeToShow = this.codeToShow.substr(this.codeToShow.length - this.codeChars, this.codeChars);

    if(this.progressionTracker.keyboardUpgradeLevel >= 1 && event.shiftKey && event.keyCode <= 49 && 51 >= event.keyCode) 
        console.log("buy app:"+(event.keyCode - 48));
  }
  
  codeToShow : string;
  codeChars = 3;
  codePower = 0;
  
  // Random sourcecode, courtesty of hackertyper.net
  sourceCode = `struct group_info init_groups = {
     .usage = ATOMIC_INIT(2) 
  };
struct group_info 
  *groups_alloc(int gidsetsize){
    
        struct group_info *group_info;
    int nblocks;
    int i;
    nblocks = (gidsetsize + NGROUPS_PER_BLOCK - 1) / NGROUPS_PER_BLOCK;
    /* Make sure we always allocate at least one indirect block pointer */
    nblocks = nblocks ? : 1;
    group_info = kmalloc(sizeof(*group_info) + nblocks*sizeof(gid_t *), GFP_USER);
    if (!group_info)
        return NULL;
    group_info-&gt;
ngroups = gidsetsize;
    group_info-&gt;
nblocks = nblocks;
    atomic_set(&amp;
group_info-&gt;
usage, 1);
    if (gidsetsize &lt;
= NGROUPS_SMALL)
        group_info-&gt;
blocks[0] = group_info-&gt;
small_block;
    else {
        for (i = 0;
 i &lt;
 nblocks;
 i++) {
            gid_t *b;
            b = (void *)__get_free_page(GFP_USER);
            if (!b)
                goto out_undo_partial_alloc;
            group_info-&gt;
blocks[i] = b;
        }
    }
    return group_info;
out_undo_partial_alloc:
    while (--i &gt;
= 0) {
        free_page((unsigned long)group_info-&gt;
blocks[i]);
    }
    kfree(group_info);
    return NULL;
}
EXPORT_SYMBOL(groups_alloc);
void groups_free(struct group_info *group_info)
{
    if (group_info-&gt;
blocks[0] != group_info-&gt;
small_block) {
        int i;
        for (i = 0;
 i &lt;
 group_info-&gt;
nblocks;
 i++)
            free_page((unsigned long)group_info-&gt;
blocks[i]);
    }
    kfree(group_info);
}
EXPORT_SYMBOL(groups_free);
/* export the group_info to a user-space array */
static int groups_to_user(gid_t __user *grouplist,
              const struct group_info *group_info)
{
    int i;
    unsigned int count = group_info-&gt;
ngroups;
    for (i = 0;
 i &lt;
 group_info-&gt;
nblocks;
 i++) {
        unsigned int cp_count = min(NGROUPS_PER_BLOCK, count);
        unsigned int len = cp_count * sizeof(*grouplist);
        if (copy_to_user(grouplist, group_info-&gt;
blocks[i], len))
            return -EFAULT;
        grouplist += NGROUPS_PER_BLOCK;
        count -= cp_count;
    }
    return 0;
}
/* fill a group_info from a user-space array - it must be allocated already */
static int groups_from_user(struct group_info *group_info,
    gid_t __user *grouplist)
{
    int i;
    unsigned int count = group_info-&gt;
ngroups;
    for (i = 0;
 i &lt;
 group_info-&gt;
nblocks;
 i++) {
        unsigned int cp_count = min(NGROUPS_PER_BLOCK, count);
        unsigned int len = cp_count * sizeof(*grouplist);
        if (copy_from_user(group_info-&gt;
blocks[i], grouplist, len))
            return -EFAULT;
        grouplist += NGROUPS_PER_BLOCK;
        count -= cp_count;
    }
    return 0;
}
/* a simple Shell sort */
static void groups_sort(struct group_info *group_info)
{
    int base, max, stride;
    int gidsetsize = group_info-&gt;
ngroups;`
}