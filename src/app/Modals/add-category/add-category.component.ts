// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { MasterService } from '../../Services/master.service';

// @Component({
//   selector: 'app-add-category',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './add-category.component.html',
//   styleUrl: './add-category.component.css',
// })
// export class AddCategoryComponent implements OnInit {
//   @Input() modalHeading: string = '';
//   @Input() mode: 'add' | 'edit' | 'view' = 'add';
//   @Input() ModalData: {
//     categoryId: number;
//     categoryName: string;
//     statusId: number;
//     statusName: string;
//   } = { categoryId: 0, categoryName: '', statusId: 0, statusName: '' };

//   @Output() successEmitter = new EventEmitter();

//   categoryForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     public activeModal: NgbActiveModal,
//     private masterService: MasterService
//   ) {
//     this.categoryForm = this.fb.group({
//       categoryName: ['', Validators.required],
//       status: ['active'],
//       description: [''],
//     });
//   }

//   ngOnInit(): void {
//     if (this.mode === 'edit' || this.mode === 'view') {
//       this.categoryForm.patchValue({
//         categoryName: this.ModalData.categoryName,
//         status:
//           this.ModalData.statusName?.toLowerCase() === 'active'
//             ? 'active'
//             : 'inactive',
//       });
//     }

//     if (this.mode === 'view') {
//       this.categoryForm.disable();
//     }
//   }

//   get isView(): boolean {
//     return this.mode === 'view';
//   }

//   isInvalid(field: string): boolean {
//     const ctrl = this.categoryForm.get(field);
//     return !!(ctrl && ctrl.invalid && ctrl.touched);
//   }

//   onSave(): void {
//     if (this.isView) return;

//     this.categoryForm.markAllAsTouched();
//     if (this.categoryForm.invalid) return;

//     const payload = {
//       CategoryId: this.ModalData.categoryId ?? 0,
//       CategoryName: this.categoryForm.value.categoryName,
//       IsActive: this.categoryForm.value.status === 'active',
//       Description: this.categoryForm.value.description ?? '',
//     };

//     this.masterService.addUpdateCategory(payload).subscribe({
//       next: (res: any) => {
//         this.activeModal.close(res.meta.status_code);
//       },
//       error: (err) => {
//         console.log('ERROR:', err);
//         this.activeModal.dismiss(err);
//       },
//     });
//   }

//   dismiss(): void {
//     this.activeModal.dismiss();
//   }
// }

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterService } from '../../Services/master.service';
import { ToastrService } from 'ngx-toastr';

function noEmoji(control: AbstractControl): ValidationErrors | null {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E0}-\u{1F1FF}]/u;
  if (control.value && emojiRegex.test(control.value)) {
    return { noEmoji: true };
  }
  return null;
}

function noOnlySpaces(control: AbstractControl): ValidationErrors | null {
  if (control.value && control.value.trim().length === 0) {
    return { noOnlySpaces: true };
  }
  return null;
}

function noSpecialCharsAtStart(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value && /^[^a-zA-Z0-9]/.test(control.value)) {
    return { noSpecialCharsAtStart: true };
  }
  return null;
}

function noConsecutiveSpaces(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value && /\s{2,}/.test(control.value)) {
    return { noConsecutiveSpaces: true };
  }
  return null;
}

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent implements OnInit {
  @Input() modalHeading: string = '';
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() ModalData: {
    categoryId: number;
    categoryName: string;
    statusId: number;
    statusName: string;
  } = { categoryId: 0, categoryName: '', statusId: 0, statusName: '' };

  @Output() successEmitter = new EventEmitter();

  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private masterService: MasterService,
    private toastrService: ToastrService
  ) {
    this.categoryForm = this.fb.group({
      categoryName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9&()\-.,\s]+$/),
          noEmoji,
          noOnlySpaces,
          noSpecialCharsAtStart,
          noConsecutiveSpaces,
        ],
      ],
      status: ['active'],
      description: [
        '',
        [Validators.maxLength(250), noEmoji, noConsecutiveSpaces],
      ],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' || this.mode === 'view') {
      this.categoryForm.patchValue({
        categoryName: this.ModalData.categoryName,
        status:
          this.ModalData.statusName?.toLowerCase() === 'active'
            ? 'active'
            : 'inactive',
      });
    }

    if (this.mode === 'view') {
      this.categoryForm.disable();
    }
  }

  get isView(): boolean {
    return this.mode === 'view';
  }

  isInvalid(field: string): boolean {
    const ctrl = this.categoryForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  getError(field: string): string {
    const ctrl = this.categoryForm.get(field);
    if (!ctrl || !ctrl.touched || !ctrl.errors) return '';
    const e = ctrl.errors;

    if (field === 'categoryName') {
      if (e['required']) return 'Category name is required.';
      if (e['noOnlySpaces']) return 'Category name cannot be only spaces.';
      if (e['noSpecialCharsAtStart'])
        return 'Must start with a letter or number.';
      if (e['minlength'])
        return `Minimum ${e['minlength'].requiredLength} characters required.`;
      if (e['maxlength'])
        return `Maximum ${e['maxlength'].requiredLength} characters allowed.`;
      if (e['noConsecutiveSpaces'])
        return 'Consecutive spaces are not allowed.';
      if (e['pattern'])
        return 'Only letters, numbers, and basic punctuation ( & ( ) - . , ) are allowed.';
      if (e['noEmoji']) return 'Emojis are not allowed.';
    }

    if (field === 'description') {
      if (e['maxlength'])
        return `Maximum ${e['maxlength'].requiredLength} characters allowed.`;
      if (e['noConsecutiveSpaces'])
        return 'Consecutive spaces are not allowed.';
      if (e['noEmoji']) return 'Emojis are not allowed.';
    }

    return 'Invalid value.';
  }

  onCategoryNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value;

    val = val.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E0}-\u{1F1FF}]/gu,
      ''
    );

    if (val.length > 50) val = val.slice(0, 50);
    input.value = val;
    this.categoryForm.get('categoryName')?.setValue(val, { emitEvent: true });
  }

  onDescriptionInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    let val = input.value;
    val = val.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E0}-\u{1F1FF}]/gu,
      ''
    );
    if (val.length > 250) val = val.slice(0, 250);
    input.value = val;
    this.categoryForm.get('description')?.setValue(val, { emitEvent: true });
  }

  get categoryNameLength(): number {
    return this.categoryForm.get('categoryName')?.value?.length ?? 0;
  }

  get descriptionLength(): number {
    return this.categoryForm.get('description')?.value?.length ?? 0;
  }

  onSave(): void {
    if (this.isView) return;

    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.invalid) return;

    const payload = {
      CategoryId: this.ModalData.categoryId ?? 0,
      CategoryName: this.categoryForm.value.categoryName.trim(),
      IsActive: this.categoryForm.value.status === 'active',
      statusId: this.categoryForm.value.status === 'active' ? 1 : 0,
      Description: (this.categoryForm.value.description ?? '').trim(),
    };

    this.masterService.addUpdateCategory(payload).subscribe({
      next: (res: any) => {
        this.activeModal.close(res.meta.status_code);
        this.toastrService.success(res.meta.status_message, 'Success');
      },
      error: (err) => {
        console.log('ERROR:', err);
        this.activeModal.dismiss(err);
        this.toastrService.success(err.meta.status_message, 'Failed');
      },
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
