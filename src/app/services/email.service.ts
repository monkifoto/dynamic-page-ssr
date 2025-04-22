import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private emailEndpoint = 'https://us-central1-afhdynamicwebsite.cloudfunctions.net/sendContactEmail';

  constructor(private http: HttpClient) {}

  sendEmail(data: any): Observable<any> {
    return this.http.post(this.emailEndpoint, data);
  }
}
