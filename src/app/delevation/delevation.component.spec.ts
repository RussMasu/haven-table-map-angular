import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelevationComponent } from './delevation.component';

describe('DelevationComponent', () => {
  let component: DelevationComponent;
  let fixture: ComponentFixture<DelevationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelevationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelevationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
