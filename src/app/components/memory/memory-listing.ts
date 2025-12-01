import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'mi-memory-listing',
  standalone: false,
  styles: `
  .example-list {
    width: 500px;
    max-width: 100%;
    border: solid 1px #ccc;
    min-height: 60px;
    display: block;
    background: white;
    border-radius: 4px;
    overflow: hidden;
  }
  .example-box {
    padding: 20px 10px;
    border-bottom: solid 1px #ccc;
    color: rgba(0, 0, 0, 0.87);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    cursor: move;
    background: white;
    font-size: 14px;
  }
  .cdk-drag-preview {
    border: none;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                0 8px 10px 1px rgba(0, 0, 0, 0.14),
                0 3px 14px 2px rgba(0, 0, 0, 0.12);
  }
  .cdk-drag-placeholder {
    opacity: 0;
  }
  .cdk-drag-animating {
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
  .example-box:last-child {
    border: none;
  }
  `,
  template: `
  <div class=" px-5 pb-5 lg:xl:flex lg:xl:justify-center lg:xl:z-0">
    <div class="bg-gray-100 p-3 w-[22rem] hidden lg:xl:block">
      <div class="text-start pl-1">
        <p class="text-[14pt] border-b pb-4.5 border-b-gray-200 font-semibold !mt-1.5 text-gray-500">
          Search Gallery
        </p>
      </div>
      <div class="grid gap-2">
        <div class="flex justify-between text-gray-600 px-1 items-center border-b border-b-gray-200">
          <p class="text-[12pt]">Select All</p>
          <div><input type="checkbox" class="border bg-white size-4 -mt-12" /></div>
        </div>
        <nz-range-picker [(ngModel)]="date" (ngModelChange)="onChange($event)"></nz-range-picker>

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
        @for (photo of photoGallery; track photo) {
        <div
          class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:shadow-green-300 transition-shadow duration-300">
          <div class="relative">
            <img nz-image appLongPress (longPress)="trigger()" width="100%" [nzSrc]="photo.image" alt="photo"
              class="cursor-pointer object-cover w-full h-32 xl:lg:md:h-52 transition-transform duration-300" />

            <div
              class="absolute top-2 left-2 opacity-[0.1] !hover:shadow-2xl !hover:shadow-green-400 p-1 px-2 cursor-pointer">
              <input type="checkbox" class="border bg-white cursor-pointer size-4 -mt-12" />
            </div>

            <div
              class="absolute top-2 right-2 bg-white/90 opacity-[0.5] !hover:shadow-2xl !hover:shadow-green-400 p-1 px-2 rounded-full   cursor-pointer">
              <nz-icon nzType="more" nz-dropdown nzTrigger="click" class="" [nzDropdownMenu]="menu"></nz-icon>
              <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu class="!w-[10rem]">
                  <li nz-submenu nzTitle="    Folder" nzIcon="folder">
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
              <p class="text-xs lg:xl:text-[11pt] text-gray-700 ">{{ photo.createdAt }}</p>
              <nz-icon [nzType]="photo.icon" class="cursor-pointer text-lg text-green-400"></nz-icon>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
    <div class="pl-2 w-[20rem] border-t border-l border-r border-gray-200 hidden lg:xl:block">
      <nz-tabs [nzTabPosition]="'top'" class="flex justify-between" nzType="card">
        <nz-tab [nzTitle]="'Folders'">
          <div class="grid gap-2" cdkDropList (cdkDropListDropped)="drop($event)" >
            @for(folder of folders; track folder) {
            <a (click)="onFolderSelection(folder.name)" [ngClass]="{
                    'px-2 flex justify-between hover:!font-semibold !items-center !text-gray-700 hover:!shadow-xl hover:!shadow-green-300 hover:!text-green-400 border-b border-b-gray-200': true,
                    '!shadow-lg !shadow-green-300 !text-green-400': currentFolder() === folder.name
                  }" cdkDrag>
              <p class="flex gap-5">
                <nz-icon [nzType]="folder.info.icon" />
                {{folder.name}}
              </p>
              <p class="">{{folder.info.files}}</p>
            </a>
            }
            @if(createNewFolder){
              <div class="flex items-center">
                <a class="px-2 flex gap-1 justify-between items-center !text-gray-500 border-b border-b-gray-200">
                  <p class="flex gap-2">
                    <nz-icon [nzType]="'folder'" />
                    <input type="text" [ngModel]="folderName()" (ngModelChange)="onFolderNameChange($event)" minlength="1" maxlength="25" placeholder="folder name" class="text-center border bg-white rounded-md px-2 -mt-12" />
                  </p>
                  <button (click)="onSaveFolder()" class="!bg-green-300 cursor-pointer flex py-1 !-mt-1 px-1 rounded-md text-white">
                    <nz-icon class="!text-white" nzType="check" />
                  </button>
              </a>
              </div>
            }

            @if(!createNewFolder){
              <a
                (click)="onCreateFolder()"
                class="px-2 flex justify-center items-center !text-gray-700 hover:!text-blue-400 border-b border-b-gray-200">
                <p class="flex gap-5">
                  Create folder
                </p>
              </a>
            }
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
  date = null;
  folderName: WritableSignal<string> = signal('')
  createNewFolder: boolean = false;
  currentFolder: WritableSignal<null | string> = signal(null)
  isDOMLoaded: WritableSignal<boolean> = signal(false)

  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

  gallery = [
    { isEdited: false, folder: 'Friends & Family', index: 11, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: false, folder: 'Cosmetics', index: 12, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=60&w=800", createdAt: new Date().toDateString(), icon: 'user' },
    { isEdited: false, folder: 'Friends & Family', index: 13, image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: true, folder: 'Friends & Family', index: 14, image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=60&w=800", createdAt: new Date().toDateString(), icon: 'user' },

    { isEdited: false, folder: 'Cosmetics', index: 15, image: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: false, folder: 'Friends & Family', index: 16, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: true, folder: 'Cosmetics', index: 17, image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: false, folder: 'Cosmetics', index: 18, image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },

    { isEdited: false, folder: 'Tech Gadgets', index: 19, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: false, folder: 'Tech Gadgets', index: 21, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: false, folder: 'Cosmetics', index: 22, image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: false, folder: 'Cosmetics', index: 23, image: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },

    { isEdited: false, folder: 'Tech Gadgets', index: 24, image: "https://images.unsplash.com/photo-1507149833265-60c372daea22?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: true, folder: 'Tech Gadgets', index: 25, image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
    { isEdited: false, folder: 'Friends & Family', index: 26, image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=60&w=800", createdAt: new Date().toDateString(), icon: 'user' },
    { isEdited: true, folder: 'Friends & Family', index: 27, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=60&w=800", createdAt: new Date().toDateString(), icon: 'branches' },
  ];

  photoGallery = this.gallery

  folders: { name: string, info: { icon: string, files: number } }[] = [
    {
      name: 'General', info: { icon: 'user', files: 120 },
    },
    {
      name: 'Edited', info: { icon: 'branches', files: 10 },
    },
    {
      name: 'Friends & Family', info: { icon: 'user', files: 70 },
    },
    {
      name: 'Cosmetics', info: { icon: 'branches', files: 20 },
    },
    {
      name: 'Tech Gadgets', info: { icon: 'branches', files: 10 },
    },
  ]

  ngOnInit(): void {
    const folderParam = this.activatedRoute.snapshot.queryParams['folder']
    if (folderParam) {
      this.currentFolder.set(folderParam)
    }
    this.folders = this.folders.map((folder) => {
      return {...folder, files: this.gallery.filter((photo) => photo.folder == folder.name).length}
    })
  }

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }

  onFolderNameChange(name: string): void {
    this.folderName.set(name)
  }

  onCreateFolder() {
    this.createNewFolder = !this.createNewFolder
  }

  trigger() {
    console.log('LONG PRESS')
  }

  onSaveFolder() {
    if (this.folderName()){
      this.folders = [...this.folders, {
        name: this.folderName(), 
        info: { icon: 'folder', files: 0 },
      }]
      this.createNewFolder = false
      this.folderName.set('')
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.folders, event.previousIndex, event.currentIndex);
  }

  onFolderSelection(folder_name: string) {
    this.currentFolder.set(folder_name);

    switch (folder_name.toLowerCase()) {
      case 'general':
        this.photoGallery = this.gallery
        break;

      case 'edited':
        this.photoGallery = this.gallery.filter((photo) => photo.isEdited)
        break;

      default:
        this.photoGallery = this.gallery.filter((photo) => photo.folder == folder_name)
        break;
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { folder: folder_name },
      queryParamsHandling: 'merge',
      replaceUrl: true,
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
