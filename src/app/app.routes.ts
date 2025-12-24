import { Routes } from '@angular/router';
import { MemoryListing } from './components/memory/listing.component';
import { Settings } from './components/settings/core.component';
import { PricingComponent } from './components/pricing/core.component';
import { LandingComponent } from './components/landing-page/core.component';
import { SubscriptionListingPage } from './components/subscriptions/listing.component';
import { LoginComponent } from './components/auth/login.component';

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '', component: App },
  { path: '', component:  MemoryListing},
  { path: 'pricing', component:  PricingComponent},
  { path: 'landing-page', component:  LandingComponent},
  { path: 'settings', component:  Settings},
  { path: 'subscriptions', component:  SubscriptionListingPage},
  { path: 'login', component:  LoginComponent},
];
