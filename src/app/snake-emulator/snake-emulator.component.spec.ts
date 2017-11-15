import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakeEmulatorComponent } from './snake-emulator.component';

describe('SnakeEmulatorComponent', () => {
  let component: SnakeEmulatorComponent;
  let fixture: ComponentFixture<SnakeEmulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnakeEmulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnakeEmulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
