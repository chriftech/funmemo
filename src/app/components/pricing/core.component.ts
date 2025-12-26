import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment';

import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: false,
  animations: [

    // Page fade-in
    trigger('pageFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),

    // Cards stagger animation
    trigger('cardStagger', [
      transition(':enter', [
        query('.pricing-card', [
          style({ opacity: 0, transform: 'translateY(40px)' }),
          stagger(150, [
            animate(
              '600ms cubic-bezier(0.4, 0, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ])
      ])
    ])
  ],
  template: `
<div class="lg:xl:px-60 w-full py-1 pt-2 px-4" @pageFade>

  <!-- Header -->
  <div class="text-center  mx-auto">
    <h1 class="text-4xl font-bold text-gray-900">
      Choose your right plan!
    </h1>
    <p class="mt-3 text-gray-500">
      Select from best plans, ensuring a perfect match. Need more or less?
    </p>

    <!-- Toggle -->
    <div class="mt-8 flex justify-center">
      <div class="bg-white rounded-full shadow p-1 flex">
        <button
          class="px-6 py-2 rounded-full text-sm font-medium"
          [class.bg-primary]="billing === 'monthly'"
          [class.text-white]="billing === 'monthly'"
          (click)="billing='monthly'">
          Monthly
        </button>

        <button
          class="px-6 py-2 rounded-full text-sm font-medium"
          [class.bg-primary]="billing === 'quarterly'"
          [class.text-white]="billing === 'quarterly'"
          (click)="billing='quarterly'">
          Quarterly (save 10%)
        </button>
      </div>
    </div>
  </div>

  <!-- Cards -->
  <div class="mt-16 gap-8  mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3" @cardStagger>

    <!-- Pro -->
    <div class="pricing-card bg-white rounded-2xl shadow p-8 flex flex-col">
      <span class="inline-block w-30! bg-purple-100 text-primary px-4 py-1 rounded-full text-xl font-semibold">
        Pro
      </span>

      <p class="mt-4 text-gray-500 text-sm">
        Ideal for those who already have a website and want improvements.
      </p>

      <div class="mt-6">
        <span class="text-4xl font-bold">$0</span>
        <span class="text-gray-500">/month</span>
      </div>

      <ul class="mt-6 space-y-3 text-sm text-gray-600">
        <li>✔ 3–5 day turnaround</li>
        <li>✔ Native Development</li>
        <li>✔ Tasks one-by-one</li>
        <li>✔ Dedicated dashboard</li>
        <li>✔ Dashboard & Slack updates</li>
      </ul>

      <button nz-button nzType="default" class="mt-auto w-full mt-8">
        Get started
      </button>
    </div>

    <!-- Pro Plus -->
    <div class="pricing-card bg-white rounded-2xl shadow-lg border-2 border-primary p-8 flex flex-col">
      <span class="inline-block bg-primary text-black px-4 py-1 rounded-full text-xl font-semibold">
        Pro Plus
      </span>

      <p class="mt-4 text-gray-500 text-sm">
        Ideal for fast scaling with strategy calls included.
      </p>

      <div class="mt-6">
        <span class="text-4xl font-bold">$25</span>
        <span class="text-gray-500">/month</span>
      </div>

      <ul class="mt-6 space-y-3 text-sm text-gray-600">
        <li>✔ 1–3 day turnaround</li>
        <li>✔ Monthly strategy call</li>
        <li>✔ Commercial license</li>
        <li>✔ Native Development</li>
        <li>✔ Dedicated dashboard</li>
        <li>✔ Dashboard & Slack updates</li>
      </ul>

      <button (click)="subscribe()" nz-button nzType="primary" class="mt-auto w-full mt-8">
        Get started
      </button>
    </div>

    <!-- Custom -->
    <div class="pricing-card bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow p-8 flex flex-col">
      <span class="inline-block w-30! bg-white text-gray-800 px-4 py-1 rounded-full text-xl font-semibold">
        Custom
      </span>

      <h3 class="mt-6 text-3xl font-bold text-gray-900">
        Let’s Talk!
      </h3>

      <ul class="mt-6 space-y-3 text-sm text-gray-700">
        <li>✔ Everything in design & development</li>
        <li>✔ Strategy workshop</li>
        <li>✔ Priority support</li>
        <li>✔ Multiple tasks at once</li>
        <li>✔ Ongoing A/B testing</li>
        <li>✔ Advanced custom dev</li>
      </ul>

      <button nz-button nzType="default" class="mt-auto w-full mt-8 bg-gray-900 text-white">
        Book a Call
      </button>
    </div>

  </div>
</div>

  `
})
export class PricingComponent {
   billing: 'monthly' | 'quarterly' = 'monthly';
  plans: PricingPlan[] = [
    {
      name: 'Free',
      price: '$0',
      description: 'For personal photo collections',
      features: [
        '100 photos',
        'Basic gallery layout',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      price: '$12',
      description: 'Best for photographers',
      popular: true,
      features: [
        '10,000 photos',
        'Custom galleries',
        'Image analytics',
        'Priority support'
      ]
    },
    {
      name: 'Studio',
      price: '$29',
      description: 'For teams and businesses',
      features: [
        'Unlimited photos',
        'Team collaboration',
        'Brand customization',
        'Advanced analytics'
      ]
    }
  ];
  loading: boolean = false
    constructor(
    private payment: PaymentService
  ) {}
  subscribe() {
    this.loading = true;
    this.payment.collectMobileMoney()
    this.loading = false
  }
}
