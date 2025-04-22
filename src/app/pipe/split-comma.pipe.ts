import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitComma',
    standalone: false
})
export class SplitCommaPipe implements PipeTransform {
  transform(value: string): any[] {
    //console.log(value);
    return value ? JSON.parse(value) : [];
  }
}
