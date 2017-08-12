import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCategoryEditComponent } from './single-category-edit.component';

describe('SingleCategoryEditComponent', () => {
  let component: SingleCategoryEditComponent;
  let fixture: ComponentFixture<SingleCategoryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
