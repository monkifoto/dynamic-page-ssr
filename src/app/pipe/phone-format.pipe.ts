import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneFormat',
    standalone: false
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | number | undefined): string {
    if (!value) return ''; // ✅ Return empty string if value is undefined or null

    let phone = value.toString().replace(/\D/g, ''); // Remove non-numeric characters

    if (phone && phone.length !== 10) return value.toString(); // ✅ Return original if not 10 digits

    return `${phone.slice(0, 3)}.${phone.slice(3, 6)}.${phone.slice(6)}`;
  }
}
