import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireRiskComponent } from './fire-risk.component';

describe('FireRiskComponent', () => {
  let component: FireRiskComponent;
  let fixture: ComponentFixture<FireRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
