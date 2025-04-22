import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceKeyword',
    standalone: false
})
export class ReplaceKeywordPipe implements PipeTransform {
  transform(value: string, replacements: { [key: string]: string }): string {
    if (!value || !replacements) {
      return value;
    }
    let result = value;
    for (const key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, replacements[key]);
      }
    }
    return result;
  }
}
