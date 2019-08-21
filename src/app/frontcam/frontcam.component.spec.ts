import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontcamComponent } from './frontcam.component';

describe('FrontcamComponent', () => {
  let component: FrontcamComponent;
  let fixture: ComponentFixture<FrontcamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontcamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontcamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
