import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mi-memory-listing',
  standalone: false,
  template: `
  <div class="px-30">
    <div class="flex justify-between items-center text-[12pt] font-bold pb-2 border-b border-b-gray-300">
      <p>MEMORIES</p>
          <a nz-button [routerLink]="" class="bg-[#937be2] text-white" >Upload</a>
    </div>

    <div class="w-full flex justify-evenly mt-7">
      <div class="grid grid-cols- gap-1">
        @for(memory of [11,13,41,15,16,17]; track memory) {
          <div class="flex justify-center">
            <img 
              nz-image
              width="200px"
              height="200px"
              nzSrc="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
              alt=""
              class="border-solid shadow-2xl rounded-md self-center"
            />
          </div>
        }
      </div>
    </div>
  </div>
  `,
  styles: ``
})
export class MemoryListing {

}
