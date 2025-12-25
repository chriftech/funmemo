import { Routes } from '@angular/router';
import { MemoryListing } from './components/memory/listing.component';
import { Settings } from './components/settings/core.component';
import { PricingComponent } from './components/pricing/core.component';
import { LandingComponent } from './components/landing-page/core.component';
import { SubscriptionListingPage } from './components/subscriptions/listing.component';
import { LoginComponent } from './components/auth/login.component';
import { authGuard } from './guards/auth';
import { SignupComponent } from './components/auth/signup.component';

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '', component: App },
  {
    path: '',
    component:  MemoryListing,
    canActivate: [authGuard]
  },
  {
    path: 'pricing',
    component:
    PricingComponent},
  {
    path: 'landing-page',
    component: LandingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: Settings,
    canActivate: [authGuard]
  },
  {
    path: 'subscriptions',
    component: SubscriptionListingPage,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  // { path: '**', redirectTo: '' },
];
