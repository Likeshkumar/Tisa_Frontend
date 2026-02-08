import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RestService } from 'app/services/rest.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'app/services/notification.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-auth-profile',
  templateUrl: './auth-profile.component.html',
  styleUrls: ['./auth-profile.component.scss']
})


export class AuthProfileComponent{

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  displayedColumns: string[] = ['sno', 'profileName', 'profileDesc', 'actions'];
  institutionId: any;
  color = '#357a38';
  dataSource: MatTableDataSource<any>;
  mode: any = 'L';
  data: any;
  profileID: any;
  menuList: any = [];
  menuItems: any[] = [];
  viewMenuList: any = [];
  profileList: any = [];
  authmode: any = 'L';
  profileName: any;
  profileFor: any;


  userId: any;
  deleteProfileId: any;
  completed: boolean;
  allComplete: boolean = false;




  profileFormGroup: FormGroup = new FormGroup({
    profileName: new FormControl('', [Validators.required]),
    profileDesc: new FormControl('', [Validators.required]),
    profileFor: new FormControl('', [Validators.required]),
    branchBasedProfile: new FormControl('', [Validators.required])
  })


  constructor(public rest: RestService,
    private spinner: NgxSpinnerService,
    public alertService: NotificationService,
    public alerts: NotificationService) { this.dataSource = new MatTableDataSource(); }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.institutionId = this.rest.readData('InstituteId');
    this.getProfileList();
  } F

  getProfileForLabel(value: string): string {
    switch (value) {
      case 'M':
        return 'Maker';
      case 'C':
        return 'Checker';
      default:
        return '';
    }
  }



  getBranchBasedLabel(value: string): string {
    switch (value) {
      case 'Y':
        return 'Yes';
      case 'N':
        return 'No';
      default:
        return '';
    }
  }

  initMenuItem() {
    this.menuItems = this.data;
  }

  getMenuitem() {
    return this.menuItems;
  }


  getProfileList() {
    this.spinner.show();

    this.rest.getwithHeader("usermanagement/profile/getAuthProfiles/P").subscribe(
      res => {

        if (res.respCode == "00") {
          this.spinner.hide();
          this.profileList = res.data;
          this.menuList = this.profileList.map(profile => {
            return profile.selectedMenuIds.map(menu => {
              menu.checked = menu.enable;
              if (menu.subMenus) {
                menu.subMenus.forEach(subMenu => {
                  subMenu.checked = subMenu.enable;
                });
              }
              return menu;
            });
          }).flat();

          this.dataSource = new MatTableDataSource(this.profileList);
          this.dataSource.sort = this.sort;

          setTimeout(() => {
            this.initTables(this.profileList);
            this.authmode = 'DEAUTH';
          }, 100);
        } else {
          this.spinner.hide();
          this.alertService.showAlert("Profile List", "Unable to fetch Profile list");
        }
      });
  }


  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterUser(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  someComplete(): boolean {
    if (this.menuList.subMenu == null) {
      return false;
    }
    return this.menuList.subMenu.filter((t: { checked: any; }) => t.checked).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean, menuData: any) {
    this.allComplete = completed;
    if (menuData.subMenu == null) {
      return;
    }
    menuData.subMenu.forEach((t: { checked: boolean; }) => (t.checked = completed));
  }


  showDetails(data: any, mode: any) {
    const postData = {
      instId: this.institutionId,
      profileName: data?.profileName || null,
      mode: mode
    };

    const url = 'usermanagement/profile/getMenu';

    this.rest.postValidate(postData, url).subscribe((res: any) => {
      if (res.respCode === '00') {
        this.data = data;
        this.profileName = this.data.profileName;
        this.profileFor = res.mkckstatus;
        this.mode = mode;

        if (mode === 'Auth' || mode === 'V') {
          this.profileFormGroup.setValue({
            profileName: data.profileName,
            profileDesc: data.profileDesc,
            branchBasedProfile: data.branchBasedProfile,
            profileFor: res.mkckstatus
          });

          this.menuList = res.data.map((menu: any) => ({
            ...menu,
            checked: menu.enable,
            subMenus: menu.subMenus.map((subMenu: any) => ({
              ...subMenu,
              checked: subMenu.enable
            }))
          }));

          this.initializeCheckedState();
        }
      } else {
        this.alerts.errorAlert(
          'Fetch Menu Details',
          res.respDesc || 'Unable to fetch menu details'
        );
      }
    });
  }



  authorize() {
    this.spinner.show();
    const formattedMenuList = this.menuList.map(item => ({
      ...item,
      checked: !!item.checked,
      subMenus: item.subMenus.map(subitem => ({
        ...subitem,
        checked: !!subitem.checked
      }))
    }));

    let addProfileData = {
      "profileName": this.profileFormGroup.value.profileName,
      "profileDesc": this.profileFormGroup.value.profileDesc,
      "mkckstatus": this.profileFormGroup.value.profileFor,
      "branchBasedProfile": this.profileFormGroup.value.branchBasedProfile,
      "instId": this.institutionId,
      "userType": "U",
      "selectedMenuIds": formattedMenuList
    };

    this.rest.postValidate(addProfileData, "usermanagement/profile/addAuth").subscribe((res: any) => {

      if (res.respCode === "00") {
        this.spinner.hide();
        this.alertService.successAlert("Add Profile", res.message);
        setTimeout(() => {
          this.profileFormGroup.reset();
          this.getProfileList();
          this.mode = 'L';
        }, 1000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert("Add Profile", res.message);
      }
    });
  }



  reject() {
    Swal.fire({
      title: 'Are you sure?',
      html: ` <b style="color: red;"> Note: Deleting the profile will remove all users associated with it. 
               Please confirm if you would like to proceed.</b> ${this.profileList.profileName}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      customClass: {
        title: 'text-red', // Add a CSS class for custom styling.
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.initReject();
      }
    });
  }


  initReject() {
    this.spinner.show();
    let deletePrfoiledata = {
      "instId": this.institutionId,
      "profileName": this.profileFormGroup.value.profileName,

    }

    this.rest.postValidate(deletePrfoiledata, "usermanagement/profile/delete").subscribe((res: any) => {

      if (res.respCode == "00") {
        this.spinner.hide();
        this.alertService.successAlert("Delete Profile", res.message);
        setTimeout(() => {
          this.getProfileList();
          this.mode = 'L';
        }, 1000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert("Delete Profile", res.message);
      }
    });

  }



  toggleItemSelection(item: any) {
    if (item.subMenus && item.subMenus.length > 0) {
      item.subMenus.forEach(subItem => {
        subItem.checked = item.checked;
      });
    } else {
      console.warn('Submenus are missing or not defined for the item.');
    }
  }

  close() {

    this.mode = 'L';

  }


  toggleParentSelection(parentItem: any): void {
    if (parentItem.subMenus && parentItem.subMenus.length > 0) {
      parentItem.subMenus.forEach((subMenu: any) => {
        subMenu.checked = parentItem.checked;
      });
    }
  }

  updateParentSelection(parentItem: any): void {
    if (parentItem.subMenus && parentItem.subMenus.length > 0) {
      const allChecked = parentItem.subMenus.every((subMenu: any) => subMenu.checked);

      if (allChecked) {
        parentItem.checked = true;
      } else {
        parentItem.checked = true;
      }
    }
  }

  initializeCheckedState() {
    this.menuList.forEach((parentItem: any) => {

      parentItem.checked = parentItem.enable;

      if (parentItem.subMenus && parentItem.subMenus.length > 0) {

        parentItem.subMenus.forEach((subItem: any) => {
          subItem.checked = subItem.enable;
        });
        const allSubMenusEnabled = parentItem.subMenus.every((subItem: any) => subItem.enable);
        if (allSubMenusEnabled) {
          parentItem.checked = true;
        }
      }
    });
  }



}

interface Menu {
  id: string;
  name: string;
  enable: boolean;
  icon: string;
  url: string | null;
  subMenus: any;
}

