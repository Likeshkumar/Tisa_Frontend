import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

interface UserReg {
  userName: string;
  profileName: string;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  mobileNo?: string;
  address?: string;
  city?: string;
  country?: string;
  branchCode?: string;
  profileId?: string;
  userId?: string;
  branchName?: string;
}

interface Profile {
  profileName: string;
  profileId: string;
  branchBasedProfile: string;
}

interface Branch {
  branchCode: string;
  branchName: string;
}

@Component({
  selector: 'app-auth-unblock-user',
  templateUrl: './auth-unblock-user.component.html',
  styleUrls: ['./auth-unblock-user.component.scss']
})

export class AuthUnblockUserComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['sno', 'userName', 'profileId', 'actions'];
  mode: 'L' | 'V' | 'Auth' = 'L';
  dataSource: MatTableDataSource<UserReg>;
  userId: string;
  userType: string;
  institutionId: string;
  profileList: Profile[] = [];
  userList: UserReg[] = [];
  branchList: Branch[] = [];
  showBranchDropdown = false;
  authmode: string = 'AUTH';
  data: any;

  userFormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    lastname: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    userName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    profileName: new FormControl('', Validators.required),
    branchCode: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern("^[0-9]{9}$")
    ]),
    address: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    city: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    country: new FormControl('CM', Validators.required),
  });

  constructor(
    public rest: RestService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public alertService: NotificationService,
    public alerts: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.institutionId = this.rest.readData('InstituteId');
    this.userId = localStorage.getItem('userId') || '';
    this.userType = localStorage.getItem('userType') || '';
    this.dataSource = new MatTableDataSource<UserReg>([]);
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFormListeners();
  }

  private loadInitialData(): void {
    this.getUserList();
    this.getProfileList();
  }

  private setupFormListeners(): void {
    this.userFormGroup.get('profileName')?.valueChanges.subscribe(value => {
      this.handleProfileChange(value);
    });
  }

  private handleProfileChange(selectedProfileName: string | null): void {
    if (!selectedProfileName) return;

    const selectedProfile = this.profileList.find(p => p.profileName === selectedProfileName);
    this.showBranchDropdown = selectedProfile?.branchBasedProfile === 'Y';

    const branchCodeControl = this.userFormGroup.get('branchCode');

    if (this.showBranchDropdown) {
      branchCodeControl?.setValidators([Validators.required]);
    } else {
      branchCodeControl?.clearValidators();
      branchCodeControl?.setValue('');
    }
    branchCodeControl?.updateValueAndValidity();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private initTables(data: UserReg[]): void {
    this.dataSource = new MatTableDataSource<UserReg>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getProfileList(): void {
    this.spinner.show();
    this.rest.getwithHeader("usermanagement/user/unblockauthlist").subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode === "00") {
          this.profileList = res.data;
          this.updateFormBasedOnProfile();
        } else {
          this.alertService.showAlert("Profile List", "Unable to fetch Profile list");
        }
      },
      (error) => {
        this.spinner.hide();
        this.alertService.showAlert("Error", "Failed to load profile list");
      }
    );
  }

  private updateFormBasedOnProfile(): void {
    const selectedProfileName = this.userFormGroup.get('profileName')?.value;
    if (selectedProfileName) {
      this.handleProfileChange(selectedProfileName);
    }
  }

  showDetails(data: UserReg, mode: 'V' | 'Auth'): void {
    this.data = data;
    this.mode = mode;
    this.patchFormValues(data);

    if (mode === 'Auth' || mode === 'V') {
      this.loadBranchList();
    }
  }

  private patchFormValues(data: UserReg): void {
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
    this.cdr.detectChanges();
  }

  private loadBranchList(): void {
    const reqData = { "instId": this.institutionId };
    this.rest.postValidate(reqData, 'get/branch').subscribe((res: any) => {
      if (res.respCode == '00') {
        this.branchList = res.branchList;
      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting branch details');
      }
    });
  }

  getUserList(): void {
    this.spinner.show();
    this.rest.getwithHeader('usermanagement/user/unblockAuthorize').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode == "00") {
          this.userList = res.data;
          this.initTables(this.userList);
          this.authmode = 'AUTH';
          this.updateBranchList();
        } else {
          this.alertService.errorAlert("User List", res.respDesc);
        }
      },
      (error) => {
        this.spinner.hide();
        this.alertService.errorAlert("Error", "Failed to load user list");
      }
    );
  }

  private updateBranchList(): void {
    if (!this.branchList.length) {
      this.branchList = this.userList
        .filter((user, index, self) =>
          index === self.findIndex(u => u.branchCode === user.branchCode))
        .map(user => ({
          branchCode: user.branchCode || '',
          branchName: user.branchName || ''
        }));
    }
  }

  authorize(): void {
    this.userFormGroup.markAllAsTouched();

    if (this.userFormGroup.invalid) {
      Object.keys(this.userFormGroup.controls).forEach(key => {
        const control = this.userFormGroup.get(key);
        if (control?.invalid) {
        }
      });

      this.alertService.errorAlert("Validation Error", "Please fill all required fields correctly");
      return;
    }

    this.spinner.show();
    const formValue = this.userFormGroup.value;

    const postData = {
      "instId": this.institutionId,
      "userName": formValue.userName,
      "profileId": this.getProfileId(formValue.profileName),
      "firstName": formValue.firstname,
      "lastName": formValue.lastname,
      "profileName": formValue.profileName,
      "branchCode": formValue.branchCode,
      "emailId": formValue.email,
      "mobileNo": formValue.mobile,
      "address": formValue.address,
      "country": formValue.country,
      "city": formValue.city,
      "userId":this.data.userId
    };

    this.rest.postValidate(postData, "usermanagement/user/unblockAuthorize").subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode == "00") {
          this.alertService.successAlert("Authorize User", res.respDesc);
          this.resetFormAndReload();
        } else {
          this.alertService.errorAlert("Authorize User", res.respDesc);
        }
      },
      (error) => {
        this.spinner.hide();
        this.alertService.errorAlert("Error", "Failed to authorize user");
      }
    );
  }

  private getProfileId(profileName: string | null | undefined): string {
    if (!profileName) return '';
    const profile = this.profileList.find(p => p.profileName === profileName);
    return profile ? profile.profileId : '';
  }

  private resetFormAndReload(): void {
    this.userFormGroup.reset();
    this.getUserList();
    this.mode = 'L';
  }

  reject(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to reject user ${this.userFormGroup.value.userName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reject'
    }).then((result) => {
      if (result.isConfirmed) {
        this.initReject();
      }
    });
  }

  private initReject(): void {
    this.spinner.show();
    const deleteData = {
      "instId": this.institutionId,
      "userName": this.userFormGroup.value.userName,
    };

    this.rest.postValidate(deleteData, "usermanagement/user/delete").subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode == "00") {
          this.alertService.successAlert("Reject User", res.respDesc);
          this.resetFormAndReload();
        } else {
          this.alertService.errorAlert("Reject User", res.respDesc);
        }
      },
      (error) => {
        this.spinner.hide();
        this.alertService.errorAlert("Error", "Failed to reject user");
      }
    );
  }

  close(): void {
    this.userFormGroup.reset();
    this.mode = 'L';
  }

  getFormControl(controlName: string): AbstractControl {
    return this.userFormGroup.get(controlName) as AbstractControl;
  }
}

