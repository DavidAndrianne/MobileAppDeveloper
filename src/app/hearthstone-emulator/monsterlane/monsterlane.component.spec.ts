import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterlaneComponent } from './monsterlane.component';

describe('MonsterlaneComponent', () => {
  let component: MonsterlaneComponent;
  let fixture: ComponentFixture<MonsterlaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterlaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
