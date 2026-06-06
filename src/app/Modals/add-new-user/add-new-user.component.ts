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
  selector: 'app-add-new-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-new-user.component.html',
  styleUrl: './add-new-user.component.css',
})
export class AddNewUserComponent {
  addUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService
  ) {
    this.addUserForm = this.fb.group({
      adminName: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', Validators.required],
      roleId: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      return;
    }

    const payload = {
      adminName: this.addUserForm.value.adminName,
      phoneNumber: this.addUserForm.value.phoneNumber,
      email: this.addUserForm.value.email,
      password: this.addUserForm.value.password,
      username: this.addUserForm.value.username,
      roleId: Number(this.addUserForm.value.roleId),
    };

  
    this.authService.addNewAdmin(payload).subscribe({
      next: (res: any) => {
        this.activeModal.close();
        this.toastrService.success(res.meta.status_message, 'Success');
      },
      error: (err) => {
        this.activeModal.dismiss();
        this.toastrService.error(err.meta.status_message, 'Failed');
      },
    });
  }
}
