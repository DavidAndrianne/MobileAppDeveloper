import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearthstoneEmulatorComponent } from './hearthstone-emulator.component';

describe('HearthstoneEmulatorComponent', () => {
  let component: HearthstoneEmulatorComponent;
  let fixture: ComponentFixture<HearthstoneEmulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearthstoneEmulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearthstoneEmulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
