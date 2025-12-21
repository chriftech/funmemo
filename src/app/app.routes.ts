import { Routes } from '@angular/router';
import { MemoryListing } from './components/memory/memory-listing';
import { Settings } from './components/memory/settings';
import { PricingComponent } from './components/pricing/pricing.component';

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '', component: App },
  { path: '', component:  MemoryListing},
  { path: 'pricing', component:  PricingComponent},
  { path: 'settings', component:  Settings}
];
