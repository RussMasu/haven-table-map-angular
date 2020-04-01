import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DstartingComponent } from './dstarting.component';

describe('DstartingComponent', () => {
  let component: DstartingComponent;
  let fixture: ComponentFixture<DstartingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DstartingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DstartingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
