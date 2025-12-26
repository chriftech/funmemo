import { Component, inject, OnInit,  } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzImageModule, NzImageService } from 'ng-zorro-antd/image';
import { MemoryModule } from './components/core-module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule, NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { AuthService } from './services/auth';

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
    RouterLink,
    NzDrawerModule,
],
  providers: [
    NzImageService,
    NzModalService,
  ],
  templateUrl: './app.html',
})
export class App implements OnInit {

  visible = false;
  placement: NzDrawerPlacement = 'left';

  collapsed = true;
  isMobile = false;

  authService = inject(AuthService)
  router = inject(Router)

  menuItems = [
    {icon: 'home', label: 'Home' },
    {icon: 'unordered-list', label: 'Memories' },
    {icon: 'info-circle', label: 'How it works' },
    {icon: 'credit-card', label: 'Pricing' },
  ];

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if(user) {
        this.authService.currentUser.set({
          email: user.email!,
          username: user.displayName!,
        })
      } else {
        this.authService.currentUser.set(null)
      }
    })
  }

  logout(){
    this.authService.logout()
    this.close()
    this.router.navigate(['login'])
  }

  isLoggedIn() {
    const user = this.authService.currentUser()
    if (user) {
      return true
    } else {
      return false
    }
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  closeSidebar() {
    this.collapsed = true;
  }

}
