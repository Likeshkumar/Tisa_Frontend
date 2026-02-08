import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['sno', 'userName', 'profileId', 'branchCode', 'status', 'addedDate', 'action'];
  mode: any = 'L';
  dataSource: MatTableDataSource<userReg>;
  userId: any;
  color = '#357a38';
  userType: any;
  institutionId: any;
  profileList: any = [];
  data: any;
  userList: any = [];
  branchList: any = [];
  showBranchDropdown = false;

  userFormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    //password: new FormControl('', [Validators.minLength(8), Validators.maxLength(12)]),
    profileName: new FormControl('', Validators.required),
    branchCode: new FormControl(''),
    firstname: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    lastname: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{9}$")]),
    address: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    city: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    country: new FormControl('CM', Validators.required)
  });

  constructor(
    public rest: RestService,
    private spinner: NgxSpinnerService,
    public alertService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.institutionId = this.rest.readData('InstituteId');
    this.userId = localStorage.getItem('userId');
    this.userType = localStorage.getItem('userType');
    this.getProfileList();
    this.getBranchData();
    this.getUserList();
  }

  getBranchData() {
    const reqData = {
      "instId": this.institutionId,
    };
    this.rest.postValidate(reqData, 'get/branch').subscribe((res: any) => {
      if (res.respCode == '00') {
        this.branchList = res.branchList;
      } else {
        this.alertService.errorAlert(res.respDesc, 'Error while getting Branch Details');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource<userReg>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onProfileChange(selectedProfileName: string) {
    const selectedProfile = this.profileList.find(p => p.profileName === selectedProfileName);
    this.showBranchDropdown = selectedProfile && selectedProfile.branchBasedProfile === 'Y';

    if (this.showBranchDropdown) {
      this.userFormGroup.get('branchCode')?.setValidators(Validators.required);
    } else {
      this.userFormGroup.get('branchCode')?.clearValidators();
      this.userFormGroup.get('branchCode')?.setValue('');
    }
    this.userFormGroup.get('branchCode')?.updateValueAndValidity();
  }

  getProfileList() {
    this.spinner.show();
    this.rest.getwithHeader("usermanagement/profile/getAllProfiles/P").subscribe(
      res => {
        this.spinner.hide();
        if (res.respCode == "00") {
          this.profileList = res.data;
        } else {
          this.alertService.showAlert("Profile List", "Unable to fetch Profile list");
        }
      },
      error => {
        this.spinner.hide();
        this.alertService.showAlert("Error", "Failed to load profiles");
      }
    );
  }

  showDetails(data: any, mode: any): void {
    this.data = data;
    this.mode = mode;

    this.userFormGroup.enable();

    if (mode == 'A') {
      this.userFormGroup.reset();
      this.showBranchDropdown = false;
      this.userFormGroup.get('country')?.setValue('CM');
    }

    if (mode == 'V' || mode == 'E') {
      this.userFormGroup.patchValue({
        firstname: data.firstName,
        lastname: data.lastName,
        userName: data.userName,
        profileName: data.profileName,
        branchCode: data.branchCode,
        email: data.emailId,
        mobile: data.mobileNo,
        address: data.address,
        city: data.city,
        country: data.country || 'CM'
      });

      const selectedProfile = this.profileList.find(p => p.profileName === data.profileName);
      this.showBranchDropdown = selectedProfile && selectedProfile.branchBasedProfile === 'Y';

      if (mode === 'V') {
        this.userFormGroup.disable();
      } else if (mode === 'E') {
        this.userFormGroup.get('userName')?.disable();
      }

      this.cdr.detectChanges();
    }
  }

  getUserList() {
    this.spinner.show();
    this.rest.getwithHeader('usermanagement/user/getAllUsersByStatus/U').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode == "00") {
          this.userList = res.data;
          this.initTables(this.userList);
        } else {
          this.alertService.errorAlert("User List", res.respDesc);
        }
      },
      error => {
        this.spinner.hide();
        this.alertService.errorAlert("Error", "Failed to load users");
      }
    );
  }

  addUser() {
    this.spinner.show();

    // The password field is commented out in the HTML. If it's conditionally rendered,
    // ensure it's present and valid when adding a user.
    // const encryptedPassword = CryptoJS.SHA256(this.userFormGroup.value.password).toString();

    let postData = {
      "instId": this.institutionId,
      "userName": this.userFormGroup.value.userName,
      // "password": encryptedPassword, // Uncomment if password is part of add user
      "profileName": this.userFormGroup.value.profileName,
      "branchCode": this.userFormGroup.value.branchCode,
      "firstName": this.userFormGroup.value.firstname,
      "lastName": this.userFormGroup.value.lastname,
      "emailId": this.userFormGroup.value.email,
      "mobileNo": this.userFormGroup.value.mobile,
      "address": this.userFormGroup.value.address,
      "country": this.userFormGroup.value.country,
      "city": this.userFormGroup.value.city,
    };

    this.rest.postValidate(postData, "usermanagement/user/add").subscribe((res: any) => {
      this.spinner.hide();
      if (res.respCode == "00") {
        this.alertService.successAlert("Add User", res.respDesc);
        this.close();
        this.getUserList();
      } else {
        this.alertService.errorAlert("Add User", res.respDesc);
      }
    },
      error => {
        this.spinner.hide();
        this.alertService.errorAlert("Error", "Failed to add user");
      });
  }

  updateUser() {
    this.spinner.show();

    let editData = {
      "instId": this.institutionId,
      "userId": this.data.userId,
      "userName": this.userFormGroup.get('userName')?.value,
      "profileName": this.userFormGroup.value.profileName,
      "branchCode": this.userFormGroup.value.branchCode,
      "firstName": this.userFormGroup.value.firstname,
      "lastName": this.userFormGroup.value.lastname,
      "emailId": this.userFormGroup.value.email,
      "mobileNo": this.userFormGroup.value.mobile,
      "address": this.userFormGroup.value.address,
      "country": this.userFormGroup.value.country,
      "city": this.userFormGroup.value.city,
    };

    this.rest.postValidate(editData, "usermanagement/user/edit").subscribe((res: any) => {
      this.spinner.hide();
      if (res.respCode == "00") {
        this.alertService.successAlert("Edit User", res.respDesc);
        this.close();
        this.getUserList();
      } else {
        this.alertService.errorAlert("Edit User", res.respDesc);
      }
    },
      error => {
        this.spinner.hide();
        this.alertService.errorAlert("Error", "Failed to update user");
      });
  }

  deleteUser(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete " + row.userName + "!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.initDeleteApi(row);
      }
    });
  }

  initDeleteApi(row: any) {
    this.spinner.show();

    let deleteData = {
      "instId": this.institutionId,
      "userName": row.userName
    };

    this.rest.postValidate(deleteData, "usermanagement/user/delete").subscribe((res: any) => {
      this.spinner.hide();
      if (res.respCode == "00") {
        this.alertService.successAlert("Delete User", res.respDesc);
        this.getUserList();
      } else {
        this.alertService.errorAlert("Delete User", res.respDesc);
      }
    },
      error => {
        this.spinner.hide();
        this.alertService.errorAlert("Error", "Failed to delete user");
      });
  }

  keyPressAlphaNumeric(event: any) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressNumeric(event: any) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  close() {
    this.userFormGroup.reset();
    this.userFormGroup.enable();
    this.mode = 'L';
  }
}

export class userReg {
  userName: string;
  profileName: string;
  branchCode: string;
}