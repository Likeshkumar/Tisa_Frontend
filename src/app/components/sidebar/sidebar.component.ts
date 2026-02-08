
// import { Component, OnInit } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
// import { EventEmitter, Output } from '@angular/core';
// import { Router } from '@angular/router';
// import { NotificationService } from 'app/services/notification.service';
// import { RestService } from 'app/services/rest.service';

// declare const $: any;
// declare interface RouteInfo {
//   path: string;
//   title: string;
//   icon: string;
//   class: string;
// }

// interface SubMenu {
//   enable: boolean;
//   name: string;
//   icon: string;
//   id: string;
//   url?: string;
// }

// interface childMenus {
//   enable: boolean;
//   name: string;
//   icon: string;
//   id: string;
//   url?: string;
// }

// export const ROUTES: RouteInfo[] = [];

// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.scss'],
//   providers: [MatIconModule]
// })

// export class SidebarComponent implements OnInit {

//   menuItems: any;
//   institutionId: any;
//   auname: any;
//   apwd: any;
//   userdetails: any;
//   activeMenuId: string | null = null;

//   @Output() menuToggled = new EventEmitter<boolean>();

//   constructor(
//     private router: Router,
//     public alerts: NotificationService,
//     public rest: RestService
//   ) {
//     this.userdetails = this.rest.readData('UserDetails');
//   }

//   ngOnInit() {
//     this.userdetails = this.rest.readData('UserDetails');
//     this.institutionId = this.rest.readData('InstituteId');
//     this.getMenuList();
//   }

//   getMenuList() {
//     const savedMenuList = this.rest.readData('menuList');
//     if (savedMenuList) {
//       try {
//         const menuList = JSON.parse(savedMenuList);
//         this.menuItems = menuList.map((menu: any) => this.formatMenu(menu));
//       } catch (e) {
//         console.error('Error parsing menu list from storage', e);
//         this.alerts.errorAlert('Invalid menu list format.', 'Error');
//       }
//     } else {
//       this.alerts.errorAlert('No menu list found. Please login again.', 'Error');
//       this.router.navigate(['/login']);
//     }
//   }

//   formatMenu(menu: any): any {
//     if (menu.subMenus) {
//       menu.subMenus = menu.subMenus.map((subMenu: any) => this.formatMenu(subMenu));
//     }
//     if (menu.childMenus) {
//       menu.childMenus = menu.childMenus.map((childMenu: any) => this.formatMenu(childMenu));
//     }
//     return menu;
//   }

//   toggleMenu(menuId: string) {
//     if (this.activeMenuId === menuId) {
//       this.activeMenuId = null;
//     } else {
//       this.activeMenuId = menuId;
//     }
//   }

//   logout() {
//     localStorage.clear();
//     this.router.navigate(['/login']);
//   }

//   isMobileMenu() {
//     return $(window).width() <= 991;
//   }
// }



import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

interface SubMenu {
  enable: boolean;
  name: string;
  icon: string;
  id: string;
  url?: string;
}

interface childMenus {
  enable: boolean;
  name: string;
  icon: string;
  id: string;
  url?: string;
}

export const ROUTES: RouteInfo[] = [];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [MatIconModule]
})
export class SidebarComponent implements OnInit {
  menuItems: any;
  institutionId: any;
  auname: any;
  apwd: any;
  userdetails: any;
  activeMenuId: string | null = null;
  activeSubMenuIds: { [parentId: string]: string | null } = {};

  @Output() menuToggled = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    public alerts: NotificationService,
    public rest: RestService
  ) {
    this.userdetails = this.rest.readData('UserDetails');
  }

  ngOnInit() {
    this.userdetails = this.rest.readData('UserDetails');
    this.institutionId = this.rest.readData('InstituteId');
    this.getMenuList();
  }

  getMenuList() {
    const savedMenuList = this.rest.readData('menuList');
    if (savedMenuList) {
      try {
        const menuList = JSON.parse(savedMenuList);
        this.menuItems = menuList.map((menu: any) => this.formatMenu(menu));
      } catch (e) {
        console.error('Error parsing menu list from storage', e);
        this.alerts.errorAlert('Invalid menu list format.', 'Error');
      }
    } else {
      this.alerts.errorAlert('No menu list found. Please login again.', 'Error');
      this.router.navigate(['/login']);
    }
  }

  formatMenu(menu: any): any {
    if (menu.subMenus) {
      menu.subMenus = menu.subMenus.map((subMenu: any) => this.formatMenu(subMenu));
    }
    if (menu.childMenus) {
      menu.childMenus = menu.childMenus.map((childMenu: any) => this.formatMenu(childMenu));
    }
    return menu;
  }

  toggleMenu(menuId: string) {
    if (this.activeMenuId === menuId) {
      this.activeMenuId = null;
      // Also clear any active submenus for this menu
      this.activeSubMenuIds[menuId] = null;
    } else {
      this.activeMenuId = menuId;
    }
  }

  toggleSubMenu(parentId: string, subMenuId: string) {
    if (this.activeSubMenuIds[parentId] === subMenuId) {
      this.activeSubMenuIds[parentId] = null;
    } else {
      // Collapse all other submenus under this parent
      this.activeSubMenuIds[parentId] = subMenuId;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isMobileMenu() {
    return $(window).width() <= 991;
  }
}