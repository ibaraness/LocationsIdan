import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLocationEditComponent } from './single-location-edit.component';

describe('SingleLocationEditComponent', () => {
  let component: SingleLocationEditComponent;
  let fixture: ComponentFixture<SingleLocationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleLocationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleLocationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
