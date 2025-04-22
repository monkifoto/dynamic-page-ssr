import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramFeedComponent } from './instagram-feed.component';

describe('InstagramFeedComponent', () => {
  let component: InstagramFeedComponent;
  let fixture: ComponentFixture<InstagramFeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstagramFeedComponent]
    });
    fixture = TestBed.createComponent(InstagramFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
