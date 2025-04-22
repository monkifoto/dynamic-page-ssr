import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpHeroComponentComponent } from './sp-hero-component.component';

describe('SpHeroComponentComponent', () => {
  let component: SpHeroComponentComponent;
  let fixture: ComponentFixture<SpHeroComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpHeroComponentComponent]
    });
    fixture = TestBed.createComponent(SpHeroComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
