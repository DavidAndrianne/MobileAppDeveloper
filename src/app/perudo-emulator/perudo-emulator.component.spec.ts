import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerudoEmulatorComponent } from './perudo-emulator.component';

describe('PerudoEmulatorComponent', () => {
  let component: PerudoEmulatorComponent;
  let fixture: ComponentFixture<PerudoEmulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerudoEmulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerudoEmulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
