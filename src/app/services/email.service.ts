import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private emailEndpoint = environment.emailEndpoint;

  constructor(private http: HttpClient) {}

  sendEmail(data: any): Observable<any> {
    return this.http.post(this.emailEndpoint, data);
  }
}
