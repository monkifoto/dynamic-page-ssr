import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tour3DComponent } from './tour-3-d.component';

describe('Tour3DComponent', () => {
  let component: Tour3DComponent;
  let fixture: ComponentFixture<Tour3DComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Tour3DComponent]
    });
    fixture = TestBed.createComponent(Tour3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
