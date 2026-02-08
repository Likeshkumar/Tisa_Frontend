import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';
import { RestService } from 'app/services/rest.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

export interface PeriodicElement {
  branchcode: string;
  branchname: string;
  reorderlevel: string;
}


@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
  providers: [MatBottomSheet, MatButtonModule]
})

export class BranchComponent implements OnInit {
  branchFromGroup = new FormGroup({
    branchCode: new FormControl('', [Validators.required]),
    branchName: new FormControl('', [Validators.required]),
    addressline1: new FormControl('', [Validators.required, Validators.maxLength(24), Validators.pattern("^[a-zA-Z0-9 ,.-]*$")]),
    addressline2: new FormControl('', [Validators.maxLength(24), Validators.pattern("^[a-zA-Z0-9 ,.-]*$")]),
    addressline3: new FormControl('', [Validators.maxLength(24), Validators.pattern("^[a-zA-Z0-9 ,.-]*$")]),
  })

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  institutionId: any;
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['sno', 'branchCode', 'branchName', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  data = [];
  columns: any = [];
  showrecords: boolean = false;
  mode: any = 'L';
  userData: any;
  userName: string;
  branchCode: any;

  constructor(
    public alerts: NotificationService,
    public alertService: NotificationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public rest: RestService,
    private cdr: ChangeDetectorRef) {
    this.userName = sessionStorage.getItem('Username');
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getBranchList();
  }


  getBranchList() {
    this.spinner.show();
    this.rest.getwithHeader('branch/get').subscribe(
      res => {
        if (res.respCode == "00") {
          this.spinner.hide();
          this.data = res.branchList;
          this.showrecords = true;
          setTimeout(() => {
            this.initTables(this.data);
          }, 100);
        }
        else {
          this.spinner.hide();
          this.alerts.errorAlert("Branch List", "Unable to get branch list");
        }
      });
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource<PeriodicElement>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  AddBranch() {
    const data = this.branchFromGroup.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'E') {
      url = 'branch/edit'
    } else {
      url = 'branch/add'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.branchFromGroup.reset();
            this.alerts.successAlert('Branch Details', res.respDesc);
            if (this.mode === 'E') {
              this.backList();
              this.getBranchList();
            } else if (this.mode === 'A' || this.mode === 'C') {
              this.backList();
              this.getBranchList();
            }
          } else {
            this.alerts.errorAlert('Branch Details', res.respDesc);
          }
        } else {
          this.alerts.errorAlert('Branch Details', res.respDesc);
        }

      })
    }
  }

  cancelBranch() {
    this.branchFromGroup.reset();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  onRowClick(item: any, action: any) {
    this.mode = action;
    if (this.mode === "E") {
      this.branchFromGroup.controls['branchCode'].disable()
    } else {
      this.branchFromGroup.controls['branchCode'].enable()
    }

    this.branchFromGroup.patchValue({
      'branchCode': item.branchCode,
      'branchName': item.branchName,
      "instId": item.instId,
      "username": item.username,
      "addressline1": item.addressline1,
      "addressline2": item.addressline2,
      "addressline3": item.addressline3,
    });
  }

  backList() {
    this.branchFromGroup.reset();
    this.mode = 'L';
    this.branchFromGroup.controls['branchCode'].enable();
    this.getBranchList();
  }

  clickAdd() {
    this.branchFromGroup.reset();
    this.mode = 'A';
  }

  clear() {
    this.branchFromGroup.reset();
  }


  add(mode: any) {
    this.mode = mode;
  }


  deleteBranch(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do You want to delete-" + item.branchName + "!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.initDeleteApi(item);
      }
    })

  }

  initDeleteApi(item) {
    this.spinner.show();

    let deleteData = {
      "instId": this.institutionId,
      "username": item.username,
      "branchCode": item.branchCode

    }

    this.branchCode = item.branchCode;

    var url = "branch/delete" + this.branchCode;
    this.rest.postValidate(deleteData, "branch/delete").subscribe((res: any) => {
      if (res.respCode == "00") {
        this.spinner.hide();
        this.alertService.successAlert('Branch Details', res.respDesc);
        setTimeout(() => {
          this.backList();
          this.getBranchList();
        }, 3000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert('Branch Details', res.respDesc);
      }
    });
  }

}




