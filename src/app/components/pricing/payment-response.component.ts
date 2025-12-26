import { Component } from "@angular/core";

@Component({
  selector: 'payment-webhook',
  standalone: false,
  template: `
    <div class="h-screen flex justify-center w-screen">
      <div>
        <p>Payment Successful</p> <br>
        <button nz-button class="" [routerLink]="['/']">Go To Gallery</button>
      </div>
    </div>
  `,
})

export class PaymentWebhook {

}
