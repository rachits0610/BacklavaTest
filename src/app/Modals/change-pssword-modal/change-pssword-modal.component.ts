import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-pssword-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-pssword-modal.component.html',
  styleUrl: './change-pssword-modal.component.css',
})
export class ChangePsswordModalComponent {
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const payload = {
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    };
    this.authService.changePassword(payload).subscribe({
      next: (res: any) => {
        this.activeModal.close();
        this.toastrService.success(res.meta.status_message, 'Success');
      },
      error: (err) => {
        this.activeModal.dismiss();
        this.toastrService.error(err.meta.status_message, 'Failed');
      },
    });

    console.log(payload);
  }
}
