import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireRiskHtmlComponent } from './fire-risk-html.component';

describe('FireRiskHtmlComponent', () => {
  let component: FireRiskHtmlComponent;
  let fixture: ComponentFixture<FireRiskHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireRiskHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireRiskHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
