import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterService } from '../../Services/master.service';
import { ToastrService } from 'ngx-toastr';

export type ModalMode = 'add' | 'edit' | 'view';

const EMOJI_RE =
  /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu;

@Component({
  selector: 'app-add-subcategory',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-subcategory.component.html',
  styleUrl: './add-subcategory.component.css',
})
export class AddSubcategoryComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
    private masterService: MasterService,
    private toastrService: ToastrService
  ) {}

  @Input() modalHeading: string = '';
  @Input() categoryDDl: any[] = [];
  @Input() mode: ModalMode = 'add';
  @Input() existingData: any = null;

  selectedCategory: string = '';
  subcategoryName: string = '';
  statusId: number | string = '';

  touched = {
    selectedCategory: false,
    subcategoryName: false,
    statusId: false,
  };

  errors = {
    selectedCategory: '',
    subcategoryName: '',
    statusId: '',
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
      this.selectedCategory = String(this.existingData.categoryId ?? '');
      this.subcategoryName = this.existingData.subCategoryName ?? '';
      this.statusId = this.existingData.statusId ?? '';
    }
  }

  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(EMOJI_RE, '');
    if (cleaned !== input.value) {
      const pos = Math.max(0, (input.selectionStart ?? 1) - 1);
      input.value = cleaned;
      input.setSelectionRange(pos, pos);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    this.subcategoryName = cleaned;
    this.validate('subcategoryName');
  }

  touch(field: string): void {
    if (field in this.touched) (this.touched as any)[field] = true;
    this.validate(field);
  }

  validate(field: string): void {
    switch (field) {
      case 'selectedCategory':
        this.errors.selectedCategory = this.selectedCategory
          ? ''
          : 'Please select a parent category';
        break;

      case 'subcategoryName': {
        const v = this.subcategoryName.trim();
        if (!v) this.errors.subcategoryName = 'Subcategory name is required';
        else if (v.length < 2)
          this.errors.subcategoryName = 'Name must be at least 2 characters';
        else if (v.length > 100)
          this.errors.subcategoryName = 'Name cannot exceed 100 characters';
        else if (!/^[a-zA-Z0-9\s\-'&().]+$/.test(v))
          this.errors.subcategoryName =
            'No special characters or emoji allowed';
        else this.errors.subcategoryName = '';
        break;
      }

      case 'statusId':
        this.errors.statusId =
          this.statusId !== '' ? '' : 'Please select a status';
        break;
    }
  }

  validateAll(): void {
    this.touched.selectedCategory = true;
    this.touched.subcategoryName = true;
    this.touched.statusId = true;
    this.validate('selectedCategory');
    this.validate('subcategoryName');
    this.validate('statusId');
  }

  isFormValid(): boolean {
    return (
      !!this.selectedCategory &&
      this.subcategoryName.trim().length >= 2 &&
      /^[a-zA-Z0-9\s\-'&().]+$/.test(this.subcategoryName.trim()) &&
      this.statusId !== '' &&
      !this.errors.selectedCategory &&
      !this.errors.subcategoryName &&
      !this.errors.statusId
    );
  }

  onSubmit(): void {
    this.validateAll();
    if (!this.isFormValid() || this.isViewMode) return;

    const payload = {
      subCategoryId: this.isEditMode
        ? this.existingData?.subCategoryId ?? 0
        : 0,
      subCategoryName: this.subcategoryName.trim(),
      categoryId: this.selectedCategory,
      statusId: Number(this.statusId),
    };

    const call$ = this.isAddMode
      ? this.masterService.addSubCategory(payload)
      : this.masterService.addSubCategory(payload);

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
