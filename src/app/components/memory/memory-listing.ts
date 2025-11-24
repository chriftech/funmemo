import { Component } from '@angular/core';

@Component({
  selector: 'mi-memory-listing',
  standalone: false,
  template: `
    <div class=" px-5 pb-5 h-screen overflow-y-scroll">
    
      <div class="flex gap-4 justify-between items-center border-b border-gray-200">
          <p class="text-xl font-bold !mt-4">Gallery</p>
        <div class="w-full">
          <input nz-input [(ngModel)]="value" placeholder="find image" class="!rounded-xl !text-lg !text-gray-600" />
        </div>
        <button
          nz-button
          (click)="uploadMemory()"
          nzType="primary"
          
          class="text-white !rounded-[0.3rem] font-bold px-4 py-1"
        >
          <nz-icon class="trigger" [nzType]="'upload'" /> Upload
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:lg:xl:gap-4 mt-8">
        @for (memory of memories; track memory.index) {
          <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:shadow-gray-400 transition-shadow duration-300">
            <div class="relative">
              <img
                nz-image
                width="100%"
                nzSrc="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000"
                alt="Memory"
                class="cursor-pointer object-cover w-full h-32 xl:lg:md:h-52 transition-transform duration-300"
              />

              <div class="absolute top-2 right-2 bg-white/90 opacity-[0.8] p-1 rounded-full shadow cursor-pointer">
                <nz-icon nzType="more"></nz-icon>
              </div>
            </div>

            <div class="p-3 pb-0">
              <div class="flex justify-between items-start">
                <p class="text-sm text-gray-700 responsive-text">{{ memory.createdAt }}</p>
                <nz-icon nzType="folder" class="cursor-pointer text-lg text-green-400"></nz-icon>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <nz-modal
      [(nzVisible)]="isVisible"
      nzTitle=""
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()"
      [nzOkLoading]="isOkLoading"
    >
      <div *nzModalContent>
        <form nz-form nzLayout="vertical" class="grid grid-cols-2 gap-x-4">
          <nz-form-item class="mt-3 col-span-2">
            <nz-form-label nzFor="proofOfPayment">
              <nz-switch
                [(ngModel)]="capture"
                [nzCheckedChildren]="uploadTemplate"
                [nzUnCheckedChildren]="cameraTemplate"
              ></nz-switch>

              <ng-template #cameraTemplate>
                <nz-icon nzType="camera"></nz-icon>
              </ng-template>

              <ng-template #uploadTemplate>
                <nz-icon nzType="upload"></nz-icon>
              </ng-template>
            </nz-form-label>

            <nz-form-control nzErrorTip=" is required">
              <ic-file-upload></ic-file-upload>
            </nz-form-control>
          </nz-form-item>
        </form>
      </div>
    </nz-modal>
  `,
})
export class MemoryListing {
  capture = true;
  isVisible = false;
  isOkLoading = false;

  proofOfPayment!: File;
  show = false;
  value = ''

  memories = [
    { index: 11, createdAt: new Date().toDateString() },
    { index: 12, createdAt: new Date().toDateString() },
    { index: 13, createdAt: new Date().toDateString() },
    { index: 14, createdAt: new Date().toDateString() },
    { index: 15, createdAt: new Date().toDateString() },
    { index: 16, createdAt: new Date().toDateString() },
    { index: 17, createdAt: new Date().toDateString() },
    { index: 18, createdAt: new Date().toDateString() },
    { index: 19, createdAt: new Date().toDateString() },
    { index: 21, createdAt: new Date().toDateString() },
    { index: 22, createdAt: new Date().toDateString() },
    { index: 23, createdAt: new Date().toDateString() },
    { index: 24, createdAt: new Date().toDateString() },
    { index: 25, createdAt: new Date().toDateString() },
    { index: 26, createdAt: new Date().toDateString() },
  ];

  uploadMemory(): void {
    this.isVisible = true;
  }

  onSearch(event: any): void {
    console.log(event);
  }

  handleOk(): void {
    this.isOkLoading = true;

    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.triggerConfetti();
    }, 1500);
  }

  triggerConfetti(): void {
    this.show = false;
    setTimeout(() => (this.show = true));
  }

  onUploadItemChanged(file: File[]): void {
    this.proofOfPayment = file[0];
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
