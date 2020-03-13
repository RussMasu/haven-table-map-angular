import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenDefaultComponent } from './screen-default.component';

describe('ScreenDefaultComponent', () => {
  let component: ScreenDefaultComponent;
  let fixture: ComponentFixture<ScreenDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
