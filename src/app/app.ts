import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouterOutlet, RouterLink, Router } from '@angular/router';
import { filter } from 'rxjs';
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
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';

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
    NzButtonModule,
    NzCardModule,
    NzTagModule,
    NzModalModule,
    NzAlertModule
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
  private activatedRoute = inject(ActivatedRoute)

  /**
   * Whether the shell's header belongs on the current page. Routes that should
   * render bare — the car selection page, for one — opt out with `data: { chrome: false }`.
   */
  showChrome = signal(true);

  menuItems = [
    {icon: 'home', label: 'Home' },
    {icon: 'unordered-list', label: 'Memories' },
    {icon: 'info-circle', label: 'How it works' },
    {icon: 'credit-card', label: 'Pricing' },
  ];

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.showChrome.set(this.deepestRouteData()['chrome'] !== false));

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

  /** Route data of the leaf route, which is where the page-level flags live. */
  private deepestRouteData(): Record<string, unknown> {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data;
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
