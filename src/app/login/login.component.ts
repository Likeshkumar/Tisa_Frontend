import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthGuardService } from 'app/services/auth-guard.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as CryptoJS from 'crypto-js';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSidenav) sideNav!: MatSidenav;
  Instituionlist: any[] = [];
  institutevalue: string = '';
  showForgotPassword: boolean = false;
  passwordStrength = '';
  passwordStrengthClass = '';
  hidePassword = true;
  hideConfirmPassword = true;
  showlogin: boolean = false;

  adminloginForm = new FormGroup({
    auname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]),
    apwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
    instid: new FormControl('', Validators.required)
  });

  forgotPasswordForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(12),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&%]+$/)
    ]),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: this.passwordsMatchValidator });

  submitted = false;
  productlist: any;
  branchlist: any;

  constructor(
    private authGuard: AuthGuardService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public rest: RestService,
    private sessionService: SessionService,
    public alertService: NotificationService,
    private observer: BreakpointObserver,
    private notifyService: NotificationService,
    private cdr: ChangeDetectorRef,) {

  }

  disablePaste(event: ClipboardEvent): void {
    event.preventDefault();
  }


  ngAfterViewInit(): void {
    this.observer.observe(['(max-width:800px)']).subscribe((res) => {
      if (res.matches) {
        this.sideNav.close();
      }
      //  else {
      //   this.sideNav.open();
      // }
    });
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    localStorage.clear();
    this.getInstitutionList();
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

  loginsubmit() {
    if (this.adminloginForm.invalid) {
      this.submitted = true;
      this.notifyService.errorAlert('Please fill all required fields correctly.', 'Validation Error');
      return;
    }

    this.submitted = true;
    localStorage.clear();
    this.spinner.show();

    const secretKey = CryptoJS.enc.Utf8.parse('1234567890123456');
    const iv = CryptoJS.enc.Utf8.parse('1234567890123456');

    const encryptedPassword = CryptoJS.AES.encrypt(
      this.adminloginForm.value.apwd || '',
      secretKey,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    ).toString();

    localStorage.setItem('encryptedPassword', encryptedPassword);

    const reqData = {
      "username": this.adminloginForm.value.auname,
      "password": encryptedPassword,
      "instid": this.adminloginForm.value.instid
    };

    this.rest.postValidate(reqData, 'login').subscribe(
      (res: any) => {
        this.spinner.hide();

        if (res.respcode === '00') {
          //this.authGuard.isLoggedin = true;
          const userDetails = res.userDetails[0];

          this.rest.saveData('SESSIONID', res.token);
          this.rest.saveData('UserDetails', JSON.stringify(res));
          this.rest.saveData('Username', this.adminloginForm.value.auname);
          this.rest.saveData('InstituteId', this.adminloginForm.value.instid);
          this.rest.saveData('password', encryptedPassword);
          this.rest.saveData('menuList', JSON.stringify(res.menuList));
          localStorage.setItem('LAST_ACTIVITY', new Date().getTime().toString());
          this.sessionService.initializeSessionMonitoring();

          if (res.userDetails && res.userDetails.length > 0) {
            const userDetails = res.userDetails[0];
            this.rest.saveData('branchCode', userDetails.branchCode);
            this.rest.saveData('branchBasedProfile', userDetails.branchBasedProfile);
            this.rest.saveData('profileFor', userDetails.profileFor);
          }

          if (res.firsttimeLogin === 'Yes') {
            this.showlogin = true;
            this.showForgotPassword = true;
            return;
          }

          if (res.userDetails && Array.isArray(res.userDetails) && res.userDetails.length > 0) {
            if (res.userDetails[0].forgotpasswordStatus === 'Enable') {
              this.showlogin = true;
              this.showForgotPassword = true;
              return;
            }
          }


          if (res.multiFactor === 'Y') {
            return;
          }

          const dashInfo = {
            dashBoarddetailsList: {
              username: userDetails.username,
              logindate: userDetails.logindate,
              profilename: userDetails.profilename,
              email: userDetails.email,
              mobile: userDetails.mobile
            }
          };

          this.rest.saveData('dashBoarddetailsList', JSON.stringify(dashInfo));
          
          this.router.navigate(['/layout/Dashboard']);

        } else {
          this.notifyService.errorAlert(res.respdesc || 'Login failed', "Alert!");
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.notifyService.errorAlert('An error occurred during login.', 'Error');
      }
    );
  }

  newPasswordChange() {

    if (this.forgotPasswordForm.invalid) {
      this.notifyService.errorAlert('Please enter a valid Password.', 'Validation Error');
      return;
    }

    const secretKey = CryptoJS.enc.Utf8.parse('1234567890123456');
    const iv = CryptoJS.enc.Utf8.parse('1234567890123456');

    const encryptedPassword = CryptoJS.AES.encrypt(
      this.forgotPasswordForm.value.confirmPassword || '',
      secretKey,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    ).toString();

    localStorage.setItem('encryptedPassword', encryptedPassword);

    const reqData = {
      "userName": this.adminloginForm.value.auname,
      "confirmPassword": encryptedPassword,
      "instId": this.adminloginForm.value.instid
    };


    this.rest.postValidate(reqData, 'usermanagement/user/changepwd').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode === '00') {
          this.alertService.successAlert('Change Password', res.respDesc);
          this.showlogin = false;
          this.showForgotPassword = false;
          this.adminloginForm.reset();
        } else {
          this.notifyService.errorAlert(res.respDesc || 'Change Password failed.', 'Alert!');
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.notifyService.errorAlert('An error occurred during OTP verification.', 'Error');
      }
    );
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

  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const newPasswordControl = form.get('newPassword');
    const confirmPasswordControl = form.get('confirmPassword');

    if (!newPasswordControl || !confirmPasswordControl) return null;

    const newPassword = newPasswordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (!confirmPassword) {
      return null;
    }

    if (newPassword !== confirmPassword) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  checkPasswordStrength() {
    const password = this.forgotPasswordForm.get('newPassword')?.value;
    if (!password) {
      this.passwordStrength = '';
      this.passwordStrengthClass = '';
      return;
    }

    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;

    if (strength <= 1) {
      this.passwordStrength = 'Weak';
      this.passwordStrengthClass = 'weak';
    } else if (strength === 2 || strength === 3) {
      this.passwordStrength = 'Medium';
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrength = 'Strong';
      this.passwordStrengthClass = 'strong';
    }
  }

  exeErr(err: any) {
    this.spinner.hide();
    console.error("Error:", err);
    this.notifyService.errorAlert('An unexpected error occurred.', 'Error');
  }
}
