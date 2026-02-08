import { NgxSpinnerService } from "ngx-spinner";
import { Component } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})

export class RequestPasswordComponent {
  requestPasswordForm: FormGroup;
  institutionId: any;
  passwordList: any = [];
  Instituionlist: any[] = [];
  institutevalue: string = '';



  adminloginForm = new FormGroup({
    auname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    apwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
    instid: new FormControl('', Validators.required)
  });

  constructor(private fb: FormBuilder,
    public rest: RestService,
    public alerts: NotificationService,
    private spinner: NgxSpinnerService,
    private notifyService: NotificationService,
    private router: Router) {
    this.requestPasswordForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern("^[a-zA-Z ]*$"), noWhitespaceValidator]],
      instid: ['', Validators.required] 
    });

  }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.getInstitutionList();
  }


  onRequestPassword() {
    const reqData = {
      "userName": this.requestPasswordForm.value.userName,
      instId: this.requestPasswordForm.value.instid
    }
    let url = 'usermanagement/user/changeRequest';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.alerts.successAlert('Request Password', res.respDesc);
        this.router.navigate(['/login']);
        this.getInstitutionList();
      } else {
        this.alerts.errorAlert('Request Password', res.respDesc);
      }
    })

  }


  getInstitutionList() {
    this.spinner.show();
    const url = 'get/instList';

    this.rest.getAll(url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.instituionlistResp(res);
        } else {
          this.exeErr('Error: Invalid response from the server.');
        }
      },
      (error: any) => {
        this.exeErr('Error: Unable to fetch institution list. ' + JSON.stringify(error));
      }
    );
  }

  instituionlistResp(res: any) {
    this.spinner.hide();
    if (res.respCode == '00') {
      this.Instituionlist = res.instList;
      this.institutevalue = this.Instituionlist[0].instName;
      this.adminloginForm.patchValue({ instid: this.institutevalue });
    } else {
      console.error('No institutions found.');
      this.notifyService.errorAlert('No institutions available.', 'Alert!');
    }
  }

  
  onInstitutionChange(event: any) {
    const selectedInstName = event.value;
    const selectedInstitution = this.Instituionlist.find(inst => inst.instName === selectedInstName);
    if (selectedInstitution) {
      this.institutevalue = selectedInstitution.instName;
    } else {
      console.warn('Selected institution not found in the list.');
      this.notifyService.errorAlert('Selected institution is invalid.', 'Warning');
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }


  exeErr(err: any) {
    this.spinner.hide();
    console.error("Error:", err);
    this.notifyService.errorAlert('An unexpected error occurred.', 'Error');
  }

}

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
}
