import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule,  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Settings } from './settings';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MemoryListing } from './memory-listing';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CoreModule } from '../../../lib/shared-components/core-module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  declarations: [
    Settings,
    MemoryListing,
  ],
  imports: [
    FormsModule,
    CommonModule,
    NzImageModule,
    NzButtonModule,
    CommonModule,
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
    NzSwitchModule,
    CoreModule,
    NzDropDownModule,
    NzTabsModule,
  ],
  exports: [
    Settings,
    MemoryListing
  ],
})
export class MemoryModule { }
