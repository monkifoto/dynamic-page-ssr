import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterTextComponent } from './center-text.component';

describe('CenterTextComponent', () => {
  let component: CenterTextComponent;
  let fixture: ComponentFixture<CenterTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenterTextComponent]
    });
    fixture = TestBed.createComponent(CenterTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
