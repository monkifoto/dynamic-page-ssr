import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableNavigationComponent } from './expandable-navigation.component';

describe('ExpandableNavigationComponent', () => {
  let component: ExpandableNavigationComponent;
  let fixture: ComponentFixture<ExpandableNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandableNavigationComponent]
    });
    fixture = TestBed.createComponent(ExpandableNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
