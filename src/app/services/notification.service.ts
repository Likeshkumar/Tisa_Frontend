import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  loading: boolean = true;

  constructor(private toastr: ToastrService) { }

  showError(message: string, title: string): void {
    this.toastr.error(message, title, {
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-center',
      toastClass: 'ngx-toastr custom-toast-error'
    });
  }

  showWarning(message: string, title: string) {
    this.toastr.warning(message, title, {
      timeOut: 7000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr custom-toast-warning',
      enableHtml: true
    });
  }

  successAlert(title: any, body: any) {
    Swal.fire({
      title: title,
      text: body,
      icon: 'success',
      backdrop: true,
      showCloseButton: true,
      timer: 5000,
      confirmButtonText: 'Dismiss'
    });
  }

  showAlert(title: any, body: any) {
    Swal.fire({
      title: title,
      text: body,
      icon: 'info',
      backdrop: true,
      timer: 5000,
      showCloseButton: true,
      confirmButtonText: 'Dismiss'
    });
  }

  errorAlert(title: any, body: any) {
    Swal.fire({
      title: title,
      text: body,
      icon: 'error',
      showConfirmButton: true,
      timer: 5000,
      showCloseButton: true,
      confirmButtonText: 'Dismiss'
    }).then(() => {
      Swal.close();
    });
  }
}