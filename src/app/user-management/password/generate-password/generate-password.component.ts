
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-generate-password',
  templateUrl: './generate-password.component.html',
  styleUrls: ['./generate-password.component.scss']
})

export class GeneratePasswordComponent{

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  displayedColumns: string[] = ['sno', 'userName', 'profileId', 'actions'];
  mode: any = 'L';
  dataSource: MatTableDataSource<userReg>;
  userId: any;
  color = '#357a38';
  userType: any;
  institutionId: any;
  profileList: any = [];
  data: any;
  userList: any = [];
  authmode; any1 = 'AUTH';
  deleteUserId: any;


  userFormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    profileName: new FormControl('', Validators.required),
    //password: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    mobile: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
  });


  constructor(public rest: RestService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public alertService: NotificationService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.institutionId = this.rest.readData('InstituteId');
    this.userId = localStorage.getItem('userId');
    this.userType = localStorage.getItem('userType');
    this.getUserList();
    this.getProfileList();

  }


  filterUser(event: Event) {
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

  getProfileList() {
    this.spinner.show();

    this.rest.getwithHeader("usermanagement/profile/getAllProfiles/P").subscribe(
      res => {

        if (res.respCode == "00") {
          this.spinner.hide();
          this.profileList = res.data;
          console.table(this.profileList);
        } else {
          this.spinner.hide();
          this.alertService.showAlert("Profile List", "Unable to fetch Profile list");
        }
      });
  }

  showDetails(data: any, mode: any): void {

    this.data = data;
    this.mode = mode;

    if (mode == 'A') {
      this.userFormGroup.reset();
      this.getProfileList();
    }

    if (mode == 'V' || mode == 'Auth') {
      this.userFormGroup.patchValue({
        firstname: data.firstName,
        lastname: data.lastName,
        username: data.userName,
        //password: data.password,
        profileName: data.profileName,
        email: data.emailId,
        mobile: data.mobileNo,
        address: data.address,
        city: data.city,
        country: data.country
      })
      this.cdr.detectChanges();

    }

  }

  getUserList() {
    this.spinner.show();

    this.rest.getwithHeader('usermanagement/user/getallpassword/changerequest').subscribe(
      (res: any) => {

        if (res.respCode == "00") {
          this.spinner.hide();
          this.userList = res.data;
          console.table(this.userList);
          setTimeout(() => {
            this.initTables(this.userList);
            this.authmode = 'AUTH';
          }, 100);
        }
        else {
          this.spinner.hide();
          this.alertService.errorAlert("User List", res.respDesc);

        }
      });
  }

  authorize() {
    this.spinner.show();

    let postData = {
      "instId": this.institutionId,
      "userName": this.userFormGroup.value.username,
      "profileId": this.userFormGroup.value.profileid,
      "firstName": this.userFormGroup.value.firstname,
      "lastName": this.userFormGroup.value.lastname,
      "profileName": this.userFormGroup.value.profileName,
      "emailId": this.userFormGroup.value.email,
      "mobileNo": this.userFormGroup.value.mobile,
      "address": this.userFormGroup.value.address,
      "country": this.userFormGroup.value.country,
      "city": this.userFormGroup.value.city,
    }

    this.rest.postValidate(postData, "usermanagement/user/addAuth").subscribe((res: any) => {

      if (res.respCode == "00") {
        this.spinner.hide();
        this.alertService.successAlert("Generate Password", res.respDesc);
        setTimeout(() => {
          this.userFormGroup.reset();
          this.getUserList();
          this.mode = 'L';
        }, 3000);
      }
      else {
        this.spinner.hide();
        this.alertService.errorAlert("Generate Password", res.respDesc);
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  reject() {

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete-" + this.userList.userName + "!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.initreject();
      }
    })

  }

  initreject() {
    this.spinner.show();

    let deleteData = {
      "instId": this.institutionId,
      "userName": this.userFormGroup.value.username,
    }

    this.deleteUserId = this.userList.userName;
    var url = "usermanagement/user/delete" + this.deleteUserId;
    this.rest.postValidate(deleteData, "usermanagement/user/delete").subscribe((res: any) => {
      if (res.respCode == "00") {
        this.spinner.hide();
        this.alertService.successAlert("Delete User", res.respDesc);
        setTimeout(() => {
          this.getUserList();
          this.mode = 'L';
        }, 3000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert("Delete User", res.respDesc);
      }
    });
  }

  close() {
    this.userFormGroup.reset();
    this.mode = 'L';

  }
}


export class userReg {
  userName: string;
  profileName: string
}










