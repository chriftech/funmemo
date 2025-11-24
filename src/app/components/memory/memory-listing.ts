import { Component } from '@angular/core';

@Component({
  selector: 'mi-memory-listing',
  standalone: false,
  template: `
    <div class="py-6 mt-10 px-5">
      
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">
        <h2 class="text-xl font-bold tracking-wide">Memories</h2>
        <button
          nz-button
          (click)="uploadMemory()"
          class="bg-[#937be2] hover:bg-[#7b64c7] text-white font-medium rounded-lg px-4 py-1"
        >
          Upload
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        @for (memory of memories; track memory) {
          <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-center">
              <img
                nz-image
                width="100%"
                height="100%" 
                nzSrc="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                alt="Memory"
                class="cursor-pointer object-cover w-full h-52 transition-transform duration-300"
              />
            </div>

            <div class="p-3">
              <p class="text-sm font-semibold text-gray-700">Memory {{ memory }}</p>
              <p class="text-xs text-gray-500">Added recently</p>
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

  memories = [11, 13, 41, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

  uploadMemory(): void {
    this.isVisible = true;
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
