import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpContactUsComponentComponent } from './sp-contact-us-component.component';

describe('SpContactUsComponentComponent', () => {
  let component: SpContactUsComponentComponent;
  let fixture: ComponentFixture<SpContactUsComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpContactUsComponentComponent]
    });
    fixture = TestBed.createComponent(SpContactUsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
