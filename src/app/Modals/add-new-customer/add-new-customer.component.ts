// import { Component, Input, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { MasterService } from '../../Services/master.service';
// import { ToastrService } from 'ngx-toastr';

// export type ModalMode = 'add' | 'edit' | 'view';

// @Component({
//   selector: 'app-add-new-customer',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './add-new-customer.component.html',
//   styleUrl: './add-new-customer.component.css',
// })
// export class AddNewCustomerComponent implements OnInit {
//   constructor(
//     private activeModal: NgbActiveModal,
//     private masterService: MasterService,
//     private toastrService: ToastrService
//   ) {}

//   @Input() modalHeading: string = '';
//   @Input() mode: ModalMode = 'add';
//   @Input() existingData: any = null;

//   fullName: string = '';
//   email: string = '';
//   phoneNumber: string = '';

//   get isViewMode(): boolean {
//     return this.mode === 'view';
//   }
//   get isEditMode(): boolean {
//     return this.mode === 'edit';
//   }
//   get isAddMode(): boolean {
//     return this.mode === 'add';
//   }

//   ngOnInit(): void {
//     if ((this.isViewMode || this.isEditMode) && this.existingData) {
//       this.fullName = this.existingData.fullName ?? '';
//       this.email = this.existingData.email ?? '';
//       this.phoneNumber = this.existingData.phoneNumber ?? '';
//     }
//   }

//   isFormValid(): boolean {
//     return (
//       this.fullName.trim().length > 0 &&
//       this.email.trim().length > 0 &&
//       this.phoneNumber.trim().length > 0
//     );
//   }

//   onSubmit(): void {
//     if (!this.isFormValid() || this.isViewMode) return;

//     const payload = {
//       customerId: this.isEditMode ? this.existingData?.userId ?? 0 : 0,
//       fullName: this.fullName.trim(),
//       email: this.email.trim(),
//       phoneNumber: this.phoneNumber.trim(),
//       statusId: 1,
//     };

//     if (this.isAddMode) {
//       this.masterService.addCustomer(payload).subscribe({
//         next: (res: any) => {
//           this.activeModal.close(res.meta.status_code);
//           this.toastrService.success(res.meta.status_message, 'Success');
//         },
//         error: (err) => {
//           this.activeModal.dismiss();
//           this.toastrService.success(err.meta.status_message, 'Success');
//         },
//       });
//     } else if (this.isEditMode) {
//       this.masterService.updateCustomer(payload).subscribe({
//         next: (res: any) => {
//           this.activeModal.close(res.meta.status_code);
//           this.toastrService.success(res.meta.status_message, 'Success');
//         },
//         error: (err) => {
//           this.activeModal.dismiss();
//           this.toastrService.success(err.meta.status_message, 'Success');
//         },
//       });
//     }
//   }

//   onCancel(): void {
//     this.activeModal.dismiss();
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterService } from '../../Services/master.service';
import { ToastrService } from 'ngx-toastr';
import { NoEmojiDirective } from '../../directives/noEmozi.directive';

export type ModalMode = 'add' | 'edit' | 'view';

const EMOJI_RE =
  /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

@Component({
  selector: 'app-add-new-customer',
  imports: [CommonModule, FormsModule, NoEmojiDirective],
  templateUrl: './add-new-customer.component.html',
  styleUrl: './add-new-customer.component.css',
})
export class AddNewCustomerComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
    private masterService: MasterService,
    private toastrService: ToastrService
  ) {}

  @Input() modalHeading: string = '';
  @Input() mode: ModalMode = 'add';
  @Input() existingData: any = null;

  fullName: string = '';
  email: string = '';
  phoneNumber: string = '';
  statusId: number = 1;

  touched = {
    fullName: false,
    email: false,
    phoneNumber: false,
    statusId: false,
  };

  errors = {
    fullName: '',
    email: '',
    phoneNumber: '',
  };

  get isViewMode(): boolean {
    return this.mode === 'view';
  }
  get isEditMode(): boolean {
    return this.mode === 'edit';
  }
  get isAddMode(): boolean {
    return this.mode === 'add';
  }

  ngOnInit(): void {
    if ((this.isViewMode || this.isEditMode) && this.existingData) {
      this.fullName = this.existingData.fullName ?? '';
      this.email = this.existingData.email ?? '';
      this.phoneNumber = this.existingData.phoneNumber ?? '';
      this.statusId = this.existingData.statusId ?? 1;
    }
  }

  onInput(event: Event, field: 'fullName' | 'email'): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(EMOJI_RE, '');
    if (cleaned !== input.value) {
      const pos = Math.max(0, (input.selectionStart ?? 1) - 1);
      input.value = cleaned;
      input.setSelectionRange(pos, pos);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (field === 'fullName') this.fullName = cleaned;
    if (field === 'email') this.email = cleaned;
    this.validate(field);
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value
      .replace(EMOJI_RE, '') // no emoji
      .replace(/[^\d+\-\s()]/g, '') // only digits, +, -, spaces, parens
      .replace(/(?!^)\+/g, ''); // + only at start
    if (cleaned !== input.value) {
      input.value = cleaned;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    this.phoneNumber = cleaned;
    this.validate('phoneNumber');
  }

  touch(field: string): void {
    if (field in this.touched) {
      (this.touched as any)[field] = true;
    }
    this.validate(field);
  }

  validate(field: string): void {
    switch (field) {
      case 'fullName': {
        const v = this.fullName.trim();
        if (!v) this.errors.fullName = 'Full name is required';
        else if (v.length < 2)
          this.errors.fullName = 'Name must be at least 2 characters';
        else if (!/^[a-zA-Z\s']+$/.test(v))
          this.errors.fullName =
            'Only letters, spaces, hyphens and apostrophes allowed';
        else this.errors.fullName = '';
        break;
      }
      case 'email': {
        const v = this.email.trim();
        if (!v) this.errors.email = 'Email address is required';
        else if (!EMAIL_RE.test(v))
          this.errors.email = 'Enter a valid email address';
        else this.errors.email = '';
        break;
      }
      case 'phoneNumber': {
        const digits = this.phoneNumber.replace(/\D/g, '');
        if (!this.phoneNumber.trim())
          this.errors.phoneNumber = 'Contact number is required';
        else if (digits.length !== 10)
          this.errors.phoneNumber = 'Contact number must be exactly 10 digits';
        else if (!/^[6-9]/.test(digits))
          this.errors.phoneNumber = 'Invalid Contact number ';
        else this.errors.phoneNumber = '';
        break;
      }
    }
  }

  validateAll(): void {
    this.touched.fullName = true;
    this.touched.email = true;
    this.touched.phoneNumber = true;
    this.touched.statusId = true;
    this.validate('fullName');
    this.validate('email');
    this.validate('phoneNumber');
  }

  isFormValid(): boolean {
    return (
      this.fullName.trim().length >= 2 &&
      /^[a-zA-Z\s'-]+$/.test(this.fullName.trim()) &&
      EMAIL_RE.test(this.email.trim()) &&
      this.phoneNumber.replace(/\D/g, '').length === 10 &&
      /^[6-9]/.test(this.phoneNumber.replace(/\D/g, '')) &&
      !this.errors.fullName &&
      !this.errors.email &&
      !this.errors.phoneNumber
    );
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  onSubmit(): void {
    this.validateAll();
    if (!this.isFormValid() || this.isViewMode) return;

    const payload = {
      customerId: this.isEditMode ? this.existingData?.userId ?? 0 : 0,
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      phoneNumber: this.phoneNumber.trim(),
      statusId: this.statusId,
    };

    const call$ = this.isAddMode
      ? this.masterService.addCustomer(payload)
      : this.masterService.updateCustomer(payload);

    call$.subscribe({
      next: (res: any) => {
        this.toastrService.success(res.meta.status_message, 'Success');
        this.activeModal.close(res.meta.status_code);
      },
      error: (err: any) => {
        this.toastrService.error(
          err.error?.meta?.status_message || 'Something went wrong',
          'Error'
        );
        this.activeModal.dismiss();
      },
    });
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
