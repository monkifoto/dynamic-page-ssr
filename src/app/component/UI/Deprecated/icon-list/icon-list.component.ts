import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-icon-list',
    templateUrl: './icon-list.component.html',
    styleUrls: ['./icon-list.component.css'],
    standalone: true,
    imports:[CommonModule]
})
export class IconListComponent implements OnInit {
  @Input() sectionTitle: string = 'Our Services';  // ✅ Dynamically set from the section
  @Input() items: any[] = []; // ✅ List of items in the section
  @Input() showLearnMore: boolean = false; // ✅ Toggle Learn More button

  constructor() {}

  ngOnInit(): void {
    // console.log("📌 Icon List Initialized:", { title: this.sectionTitle, items: this.items });
  }
}
