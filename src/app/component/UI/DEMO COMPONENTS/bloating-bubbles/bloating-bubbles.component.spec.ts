import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloatingBubblesComponent } from './bloating-bubbles.component';

describe('BloatingBubblesComponent', () => {
  let component: BloatingBubblesComponent;
  let fixture: ComponentFixture<BloatingBubblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloatingBubblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloatingBubblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
