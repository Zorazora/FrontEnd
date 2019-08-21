import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackcamComponent } from './backcam.component';

describe('BackcamComponent', () => {
  let component: BackcamComponent;
  let fixture: ComponentFixture<BackcamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackcamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackcamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
