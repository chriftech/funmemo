import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mi-memory-listing',
  standalone: false,
  template: `
<div class=" px-5 pb-5 flex z-0">
  <div class="bg-gray-100 p-3 w-[20rem]">
    <div class="text-center">
      <p class="text-[14pt] border-b pb-4.5 border-b-gray-200 font-semibold !mt-1.5 text-gray-500">
        Find My Image
      </p>
    </div>
    <div class="grid gap-2">
      <p>date range field</p>
      <div class="flex justify-between items-center border-b border-b-gray-200">
      
        <p class="text-[12pt]">Select All</p>
        <div><input type="checkbox" class="border bg-white size-4" /></div>
      </div>
      <input class="border bg-white" />
      <input class="border bg-white" />
    </div>
  </div>
  <div class="px-5 border-t border-t-gray-200 overflow-y-scroll h-screen shadow-blue-400 shadow-2xl pb-4">

    <div class="flex gap-4 blur-2xl justify-between items-center border-b border-gray-200">
      <div
        class="pointer-events-none fixed top-0 left-0 -z-10 w-[18rem] h-[28rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,_#F200FF33,_#EBFBFF)] blur-3xl opacity-100">
      </div>
      <div
        class="pointer-events-none fixed bottom-0 right-0 -z-10 w-[4rem] h-[32rem] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(circle,_#F200FF33,_#EBFBFF)] blur-3xl opacity-80">
      </div>
    </div>
    <div class="flex gap-4 justify-between items-center border-b border-gray-200">
      <p class="text-xl blur-none font-bold !mt-4 z-0">Gallery</p>
      <button type="button" (click)="uploadMemory()" [ngClass]="{
        '!text-white !py-2 bg-gradient-to-br from-pink-300 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 rounded-md cursor-pointer text-center leading-5 flex gap-1': true,
        '!shadow-md !shadow-blue-500': isDOMLoaded()
      }"><nz-icon class="trigger" [nzType]="'upload'" /> Upload</button>

    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:lg:xl:gap-4 mt-8">
      @for (memory of memories; track memory.index) {
      <div
        class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:shadow-green-300 transition-shadow duration-300">
        <div class="relative">
          <img nz-image width="100%" [nzSrc]="memory.image" alt="Memory"
            class="cursor-pointer object-cover w-full h-32 xl:lg:md:h-52 transition-transform duration-300" />

          <div
            class="absolute top-2 right-2 bg-white/90 opacity-[0.5] !hover:shadow-2xl !hover:shadow-green-400 p-1 px-2 rounded-full   cursor-pointer">
            <nz-icon nzType="more" nz-dropdown nzTrigger="click" class="" [nzDropdownMenu]="menu"></nz-icon>
            <nz-dropdown-menu #menu="nzDropdownMenu">
              <ul nz-menu class="!w-[10rem]">
                <li nz-submenu nzTitle="Folder">
                  <ul>
                    <li nz-menu-item><nz-icon nzType="user" /> Friends & Family</li>
                    <li nz-menu-item><nz-icon nzType="branches" /> Events</li>
                    <li nz-menu-item><nz-icon nzType="plus-circle" /> Create new</li>
                  </ul>
                </li>
                <li nz-menu-item></li>
                <li nz-menu-divider></li>
                <li nz-menu-item class="!text-center !flex !gap-2"> <nz-icon nzType="user" /> Edit</li>
                <li nz-menu-divider></li>
                <li nz-menu-item class="!text-center !text-red-500"> <nz-icon nzType="delete" /> Delete</li>
              </ul>
            </nz-dropdown-menu>
          </div>
        </div>

        <div class="p-3 pb-0">
          <div class="flex justify-between items-start">
            <p class="text-xs lg:xl:text-[11pt] text-gray-700 ">{{ memory.createdAt }}</p>
            <nz-icon [nzType]="memory.folder" class="cursor-pointer text-lg text-green-400"></nz-icon>
          </div>
        </div>
      </div>
      }
    </div>
  </div>
  <div class="pl-2 w-[20rem] border-t border-l border-r border-gray-200">
    <nz-tabs [nzTabPosition]="'top'" class="flex justify-between" nzType="card">
      <nz-tab [nzTitle]="'Folders'">
        <div class="grid gap-2">
          @for(folder of folders; track folder) {
          <a (click)="onFolderSelection(folder.name)" [ngClass]="{
                  'px-2 flex justify-between hover:!font-semibold !items-center !text-gray-700 hover:!shadow-xl hover:!shadow-green-300 hover:!text-green-400 border-b border-b-gray-200': true,
                  '!shadow-lg !shadow-green-300 !text-green-400': currentFolder() === folder.name
                }">
            <p class="flex gap-5">
              <nz-icon [nzType]="folder.icon" />
              {{folder.name}}
            </p>
            <p class="">{{folder.files}}</p>
          </a>
          }
          <a
            class="px-2 flex justify-between !items-center !text-gray-700 hover:!text-blue-400 border-b border-b-gray-200">
            <p><nz-icon nzType="plus-circle" /></p>
            <p class="flex gap-5">
              Create new folder
            </p>
            <p class="">1</p>
          </a>
        </div>
      </nz-tab>
      <nz-tab [nzTitle]="'Stats'" class="text-end">
        <div class="px-2">
          Total Files
        </div>
      </nz-tab>
      <nz-tab [nzTitle]="'Settings'" class="text-end">
        <div class="px-2">
          Total Files
        </div>
      </nz-tab>
    </nz-tabs>
  </div>
</div>

<nz-modal [(nzVisible)]="isVisible" nzTitle="" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()"
  [nzOkLoading]="isOkLoading">
  <div *nzModalContent>
    <form nz-form nzLayout="vertical" class="grid grid-cols-2 gap-x-4">
      <nz-form-item class="mt-3 col-span-2">
        <nz-form-label nzFor="proofOfPayment">
          <nz-switch [ngModel]="capture" (ngModelChange)="onSwitch()" [nzCheckedChildren]="uploadTemplate"
            [nzUnCheckedChildren]="cameraTemplate"></nz-switch>

          <ng-template #cameraTemplate>
            <nz-icon nzType="camera"></nz-icon>
          </ng-template>

          <ng-template #uploadTemplate>
            <nz-icon nzType="upload"></nz-icon>
          </ng-template>
        </nz-form-label>

        <nz-form-control nzErrorTip=" is required">
          <div class="flex justify-center items-center">
            @if(capture){
            <nz-icon nzType="camera" class="text-[20rem]" />
            } @else {
            <ic-file-upload></ic-file-upload>
            }
          </div>
        </nz-form-control>
      </nz-form-item>
    </form>
  </div>
</nz-modal>
  `,
})
export class MemoryListing implements OnInit {
  capture = true;

  isVisible = false;
  isOkLoading = false;

  proofOfPayment!: File;
  show = false;
  value = ''
  menu = ''
  currentFolder: WritableSignal<null | string> = signal(null)
  isDOMLoaded: WritableSignal<boolean> = signal(false)

  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

  memories = [
    { index: 11, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 12, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=60&w=800", createdAt: new Date().toDateString(), folder: 'user' },
    { index: 13, image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 14, image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=60&w=800", createdAt: new Date().toDateString(), folder: 'user' },

    { index: 15, image: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 16, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 17, image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 18, image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },

    { index: 19, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 21, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 22, image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 23, image: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },

    { index: 24, image: "https://images.unsplash.com/photo-1507149833265-60c372daea22?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 25, image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
    { index: 26, image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=60&w=800", createdAt: new Date().toDateString(), folder: 'user' },
    { index: 27, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=60&w=800", createdAt: new Date().toDateString(), folder: 'branches' },
  ];

  folders: {name: string, icon: string, files: number}[] = [
    { name: 'General', icon: 'user', files: 120 },
    { name: 'Edited', icon: 'branches', files: 10 },
    { name: 'Friends & Family', icon: 'user', files: 70 },
    { name: 'Travel', icon: 'branches', files: 10 },
    { name: 'Cosmetics', icon: 'branches', files: 20 },
    { name: 'Furniture', icon: 'branches', files: 30 },
    { name: 'Clothing', icon: 'branches', files: 20 },
    { name: 'Tech Gadgets', icon: 'branches', files: 10 },
  ]

  ngOnInit(): void {
    const folderParam = this.activatedRoute.snapshot.queryParams['folder']
    if (folderParam){
      this.currentFolder.set(folderParam)
    }


    for (let index = 0; index < 6; index++) {
      setTimeout(() => {
        this.isDOMLoaded.set(!this.isDOMLoaded())
      }, 100);
    }
    this.isDOMLoaded.set(false)
  }

  onFolderSelection(folder_name: string) {
    this.currentFolder.set(folder_name);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { folder: folder_name },
      queryParamsHandling: 'merge',
      replaceUrl: true,     // prevents history entries
    });
  }

  uploadMemory(): void {
    this.isVisible = true;
  }

  onSwitch() {
    this.capture = false
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
