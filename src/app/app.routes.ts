import { Routes } from '@angular/router';
import { MemoryListing } from './components/memory/memory-listing';
import { Settings } from './components/memory/settings';

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '', component: App },
  { path: '', component:  MemoryListing},
  { path: 'settings/', component:  Settings},
];
