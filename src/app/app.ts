import { Component,  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzImageModule, NzImageService } from 'ng-zorro-antd/image';
import { MemoryModule } from './components/memory/memory-module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    NzIconModule,
    NzModalModule,
    NzButtonModule,
    RouterOutlet,
    NzImageModule,
    MemoryModule,
    NzBreadCrumbModule, 
    NzMenuModule, 
    NzLayoutModule,
  ],
  providers: [
    NzImageService,
    NzModalService,
  ],
  templateUrl: './app.html',
})
export class App {

  collapsed = true;
  isMobile = false;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  closeSidebar() {
    this.collapsed = true;
  }

  menuItems = [
    {icon: 'home', label: 'Home' },
    {icon: 'unordered-list', label: 'Memories' },
    {icon: 'info-circle', label: 'How it works' },
    {icon: 'credit-card', label: 'Pricing' },
  ];
}
