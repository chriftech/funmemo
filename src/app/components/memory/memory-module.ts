import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoryDetail } from './memory-detail';
import { MemoryListing } from './memory-listing';
import { MemoryUpload } from './memory-upload';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink, RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MemoryDetail,
    MemoryListing,
    MemoryUpload,
  ],
  imports: [
    CommonModule,
    CommonModule,
    NzImageModule,
    NzButtonModule,
    RouterModule,
  ],
  exports: [
    MemoryDetail,
    MemoryListing,
    MemoryUpload,
  ],
  bootstrap: [NzImageModule]
})
export class MemoryModule { }
