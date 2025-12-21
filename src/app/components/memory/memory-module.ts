import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule,  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Settings } from './settings';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MemoryListing } from './memory-listing';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CoreModule } from '../../../lib/shared-components/core-module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {CdkDrag, CdkDropList} from '@angular/cdk/drag-drop';
import { WebcamModule } from "ngx-webcam";
import { PricingComponent } from '../pricing/pricing.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [
    Settings,
    MemoryListing,
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
  ],
  exports: [
    Settings,
    MemoryListing,
  ],
})
export class MemoryModule { }
