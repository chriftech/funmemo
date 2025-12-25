import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule,  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Settings } from './settings/core.component';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MemoryListing } from './memory/listing.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CoreModule } from '../../lib/shared-components/core-module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {CdkDrag, CdkDropList} from '@angular/cdk/drag-drop';
import { WebcamModule } from "ngx-webcam";
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { SubscriptionListingPage } from './subscriptions/listing.component';
import { PricingComponent } from './pricing/core.component';
import {NzBadgeModule} from 'ng-zorro-antd/badge'
import { NzTableModule } from 'ng-zorro-antd/table';
import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/signup.component';

@NgModule({
  declarations: [
    Settings,
    MemoryListing,
    SubscriptionListingPage,
    PricingComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    NzSwitchModule,
    FormsModule,
    CommonModule,
    NzImageModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzButtonModule,
    RouterOutlet,
    NzImageModule,
    NzLayoutModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzUploadModule,
    CoreModule,
    NzDropDownModule,
    NzTabsModule,
    CdkDrag,
    CdkDropList,
    NzDatePickerModule,
    WebcamModule,
    RouterLinkWithHref,
    NzCardModule,
    NzTagModule,
    NzBadgeModule,
    NzTableModule,
  ],
  exports: [
    Settings,
    MemoryListing,
    SubscriptionListingPage,
    PricingComponent,
    LoginComponent,
    SignupComponent,
  ],
})
export class MemoryModule { }
