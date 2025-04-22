import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetTheTeamComponent } from './meet-the-team.component';

describe('MeetTheTeamComponent', () => {
  let component: MeetTheTeamComponent;
  let fixture: ComponentFixture<MeetTheTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetTheTeamComponent]
    });
    fixture = TestBed.createComponent(MeetTheTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
