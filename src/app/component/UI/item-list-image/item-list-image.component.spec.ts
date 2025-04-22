import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListImageComponent } from './item-list-image.component';

describe('ItemListImageComponent', () => {
  let component: ItemListImageComponent;
  let fixture: ComponentFixture<ItemListImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemListImageComponent]
    });
    fixture = TestBed.createComponent(ItemListImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
