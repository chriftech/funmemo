import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PaymentService {

  private apiUrl = 'http://api.lipila.dev/api/v1/collections/mobile-money';
  constructor(private http: HttpClient) {}

  collectMobileMoney() {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': 'lsk_019b2cb1-4928-7bca-878e-b102f2080f38'
    });

    const body = {
      referenceId: '1234512323',
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
