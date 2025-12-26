import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environements/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {

  private apiUrl = environment.payment.url;
  constructor(private http: HttpClient) {}

  collectMobileMoney() {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': environment.payment.apiKey
    });

    const body = {
      referenceId: 'a652',
      amount: 1,
      narration: 'TEST',
      accountNumber: '260771625841',
      currency: 'ZMW',
      email: 'developersiame@gmail.com'
    };

    this.http.post(this.apiUrl, body, { headers }).subscribe(value => {
      console.log("RESPONSE: ", value)
      return value
    });
  }
}
