import { Pipe, PipeTransform } from '@angular/core';
import { Section } from '../model/section.model';

@Pipe({
    name: 'sectionFilter',
    standalone: false
})
export class SectionFilterPipe implements PipeTransform {
  transform(sections: Section[], page: string, location: string): Section | null {
    if (!sections || !page || !location) return null;

    return sections.find(section => section.page === page && section.location === location) || null;
  }
}
