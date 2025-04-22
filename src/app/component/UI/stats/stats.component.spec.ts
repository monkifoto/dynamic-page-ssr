import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallaxStatsComponent } from './stats.component';

describe('ParallaxStatsComponent', () => {
  let component: ParallaxStatsComponent;
  let fixture: ComponentFixture<ParallaxStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParallaxStatsComponent]
    });
    fixture = TestBed.createComponent(ParallaxStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
