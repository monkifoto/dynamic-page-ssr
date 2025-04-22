import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitComma',
    standalone: true,
    imports:[CommonModule]
})
export class SplitCommaPipe implements PipeTransform {
  transform(value: string): any[] {
    //console.log(value);
    return value ? JSON.parse(value) : [];
  }
}
