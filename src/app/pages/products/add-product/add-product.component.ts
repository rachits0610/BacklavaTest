import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { BreadcrumComponent } from '../../../components/breadcrum/breadcrum.component';
import { MainService } from '../../../Services/main.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environments';

const BASE_URL = environment.BaseURL;

function noEmoji(ctrl: AbstractControl): ValidationErrors | null {
  const v: string = ctrl.value ?? '';
  return /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu.test(v)
    ? { emojiNotAllowed: true }
    : null;
}

function positiveNumber(ctrl: AbstractControl): ValidationErrors | null {
  const v = ctrl.value;
  if (v === null || v === '') return null;
  return Number(v) < 1 ? { min: true } : null;
}

function lettersSpacesOnly(ctrl: AbstractControl): ValidationErrors | null {
  const v: string = (ctrl.value ?? '').trim();
  return v && !/^[A-Za-z0-9\s\-().,'"/]+$/.test(v)
    ? { invalidChars: true }
    : null;
}

function slugValidator(ctrl: AbstractControl): ValidationErrors | null {
  const v: string = (ctrl.value ?? '').trim();
  return v && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)
    ? { invalidSlug: true }
    : null;
}

function sizeValidator(ctrl: AbstractControl): ValidationErrors | null {
  const v: string = (ctrl.value ?? '').trim();
  if (!v) return null;
  if (/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu.test(v))
    return { emojiNotAllowed: true };
  if (!/^[A-Za-z0-9\s().,'"/]+$/.test(v)) return { invalidChars: true };
  return null;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  @Input() product: any = null;
  isEditMode = false;
  isSubmitting = false;
  productForm!: FormGroup;

  statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  weightUnits = [
    { label: 'Gram', value: 1 },
    { label: 'Kilogram', value: 2 },
  ];

  categoryDDl: any[] = [];
  subcategoryDDl: any[] = [];
  selectedCategoryId: number | null = null;

  productImageBase64: string | null = null;
  productImagePreview: string | null = null;

  skuImageBase64: (string | null)[][] = [[]];
  skuImagePreview: (string | null)[][] = [[]];

  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private toastr: ToastrService
  ) {
    const state = history.state;
    if (state?.product) this.product = state.product;
  }

  ngOnInit(): void {
    this.isEditMode = !!this.product;

    this.productForm = this.fb.group({
      productId: [0],
      productName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noEmoji,
          lettersSpacesOnly,
        ],
      ],
      slug: ['', [Validators.required, slugValidator]],
      statusId: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      subCategoryId: ['', [Validators.required]],
      details: ['', [noEmoji]],
      productSkus: this.fb.array([this.createSku()]),
    });

    this.loadCategoryDDl();
  }

  private buildImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('data:')
    )
      return url;
    return BASE_URL + url;
  }

  private readFile(file: File): Promise<{ raw: string; preview: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        resolve({ raw: preview, preview });
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  private parseWeight(raw: string | null | undefined): {
    value: number | null;
    unitId: number;
  } {
    if (!raw) return { value: null, unitId: 1 };
    const lower = raw.trim().toLowerCase();
    const match = lower.match(/^([\d.]+)\s*(kg|g|kilogram|gram)?/);
    if (!match) return { value: null, unitId: 1 };
    const numericValue = parseFloat(match[1]);
    const unit = match[2] ?? 'g';
    const unitId = unit.startsWith('k') ? 2 : 1;
    return { value: isNaN(numericValue) ? null : numericValue, unitId };
  }

  loadCategoryDDl(): void {
    this.mainService.getCategoriesDDl().subscribe({
      next: (res: any) => {
        this.categoryDDl = res.data;
        if (this.isEditMode && this.product) this.patchForm(this.product);
      },
    });
  }

  loadSubCategories(categoryId: number, patchSubCatId?: number): void {
    this.mainService.getSubCategoryDDl(categoryId).subscribe({
      next: (res: any) => {
        this.subcategoryDDl = res.data;
        if (patchSubCatId != null)
          this.productForm.get('subCategoryId')?.setValue(patchSubCatId);
      },
    });
  }

  patchForm(data: any): void {
    this.selectedCategoryId = data.categoryId ?? null;
    this.productForm.patchValue({
      productId: data.productId,
      productName: data.productName,
      slug: data.slug ?? '',
      statusId: data.statusId,
      categoryId: data.categoryId ?? null,
      details: data.details ?? '',
    });

    if (data.categoryId) {
      this.loadSubCategories(data.categoryId, data.subCategoryId);
    } else {
      this.productForm
        .get('subCategoryId')
        ?.setValue(data.subCategoryId ?? null);
    }

    this.productImagePreview = this.buildImageUrl(data.imageUrl);
    this.productImageBase64 = this.productImagePreview;

    const skusArray = this.skusArray;
    skusArray.clear();
    this.skuImageBase64 = [];
    this.skuImagePreview = [];

    (data.productSkus ?? []).forEach((sku: any) => {
      const skuGroup = this.createSku();
      const { value: weightValue, unitId: weightUnitId } = this.parseWeight(
        sku.weight
      );

      skuGroup.patchValue({
        skusId: sku.skusId,
        weightValue: weightValue,
        weightUnitId: sku.weightUnitId ?? weightUnitId,
        size: sku.size != null ? String(sku.size) : '',
        price: sku.price,
        statusId: sku.statusId ?? 1,
      });

      const imagesArr = skuGroup.get('productImages') as FormArray;
      imagesArr.clear();
      const b64s: (string | null)[] = [];
      const previews: (string | null)[] = [];

      (sku.productImages ?? []).forEach((img: any) => {
        imagesArr.push(this.createSkuImage(img.productImageId ?? 0));
        const preview = this.buildImageUrl(img.imageUrl ?? null);
        b64s.push(preview);
        previews.push(preview);
      });

      if (imagesArr.length === 0) {
        imagesArr.push(this.createSkuImage());
        b64s.push(null);
        previews.push(null);
      }

      skusArray.push(skuGroup);
      this.skuImageBase64.push(b64s);
      this.skuImagePreview.push(previews);
    });

    if (skusArray.length === 0) {
      skusArray.push(this.createSku());
      this.skuImageBase64.push([null]);
      this.skuImagePreview.push([null]);
    }
  }

  get skusArray(): FormArray {
    return this.productForm.get('productSkus') as FormArray;
  }

  skuImagesArray(skuIndex: number): FormArray {
    return (this.skusArray.at(skuIndex) as FormGroup).get(
      'productImages'
    ) as FormArray;
  }

  createSku(): FormGroup {
    return this.fb.group({
      skusId: [0],
      weightValue: [
        null,
        [Validators.required, Validators.min(1), positiveNumber],
      ],
      weightUnitId: ['', [Validators.required]],
      size: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(1), positiveNumber]],
      statusId: ['', []],
      productImages: this.fb.array([this.createSkuImage()]),
    });
  }

  createSkuImage(id = 0): FormGroup {
    return this.fb.group({ productImageId: [id] });
  }

  addSku(): void {
    this.skusArray.push(this.createSku());
    this.skuImageBase64.push([null]);
    this.skuImagePreview.push([null]);
  }

  removeSku(i: number): void {
    this.skusArray.removeAt(i);
    this.skuImageBase64.splice(i, 1);
    this.skuImagePreview.splice(i, 1);
  }

  clickSkuFileInput(skuIdx: number, imgIdx: number): void {
    const input = document.getElementById(
      `skuFile_${skuIdx}_${imgIdx}`
    ) as HTMLInputElement | null;
    input?.click();
  }

  triggerSkuFileInput(skuIdx: number): void {
    const newImgIdx = this.skuImagesArray(skuIdx).length;
    this.skuImagesArray(skuIdx).push(this.createSkuImage());
    this.skuImageBase64[skuIdx].push(null);
    this.skuImagePreview[skuIdx].push(null);

    setTimeout(() => {
      const input = document.getElementById(
        `skuFile_${skuIdx}_${newImgIdx}`
      ) as HTMLInputElement | null;
      if (!input) return;

      const onFileChosen = (e: Event) => {
        input.removeEventListener('change', onFileChosen);
        if (!(e.target as HTMLInputElement).files?.length) {
          this.skuImagesArray(skuIdx).removeAt(newImgIdx);
          this.skuImageBase64[skuIdx].splice(newImgIdx, 1);
          this.skuImagePreview[skuIdx].splice(newImgIdx, 1);
        }
      };
      input.addEventListener('change', onFileChosen);
      input.click();
    }, 0);
  }

  removeSkuImage(skuIdx: number, imgIdx: number): void {
    this.skuImagesArray(skuIdx).removeAt(imgIdx);
    this.skuImageBase64[skuIdx].splice(imgIdx, 1);
    this.skuImagePreview[skuIdx].splice(imgIdx, 1);
  }

  async onSkuFileSelect(
    event: Event,
    skuIdx: number,
    imgIdx: number
  ): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const { raw, preview } = await this.readFile(file);
    this.skuImageBase64[skuIdx][imgIdx] = raw;
    this.skuImagePreview[skuIdx][imgIdx] = preview;
  }

  async onSkuFileDrop(
    event: DragEvent,
    skuIdx: number,
    imgIdx: number
  ): Promise<void> {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    const { raw, preview } = await this.readFile(file);
    this.skuImageBase64[skuIdx][imgIdx] = raw;
    this.skuImagePreview[skuIdx][imgIdx] = preview;
  }

  clearSkuImage(event: MouseEvent, skuIdx: number, imgIdx: number): void {
    event.stopPropagation();
    this.skuImageBase64[skuIdx][imgIdx] = null;
    this.skuImagePreview[skuIdx][imgIdx] = null;
  }

  async onProductImageSelect(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const { raw, preview } = await this.readFile(file);
    this.productImageBase64 = raw;
    this.productImagePreview = preview;
  }

  async onProductImageDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    const { raw, preview } = await this.readFile(file);
    this.productImageBase64 = raw;
    this.productImagePreview = preview;
  }

  clearProductImage(event: MouseEvent): void {
    event.stopPropagation();
    this.productImageBase64 = null;
    this.productImagePreview = null;
  }

  onCategoryChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.selectedCategoryId = id;
    this.productForm.get('subCategoryId')?.setValue('');
    this.subcategoryDDl = [];
    this.loadSubCategories(id);
  }

  onProductNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(
      /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
      ''
    );
    val = val.replace(/[^A-Za-z0-9\s\-().,'"/]/g, '');
    input.value = val;
    this.productForm.get('productName')?.setValue(val, { emitEvent: false });
    this.productForm.get('productName')?.markAsTouched();
  }

  onSlugInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-{2,}/g, '-');
    input.value = val;
    this.productForm.get('slug')?.setValue(val, { emitEvent: false });
    this.productForm.get('slug')?.markAsTouched();
  }

  onDetailsInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    let val = input.value.replace(
      /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
      ''
    );
    input.value = val;
    this.productForm.get('details')?.setValue(val, { emitEvent: false });
  }

  onWeightInput(event: Event, si: number): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
    input.value = val;
    (this.skusArray.at(si) as FormGroup)
      .get('weightValue')
      ?.setValue(val === '' ? null : Number(val), { emitEvent: false });
    (this.skusArray.at(si) as FormGroup).get('weightValue')?.markAsTouched();
  }

  onPriceInput(event: Event, si: number): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
    if (parts[1]?.length > 2) val = parts[0] + '.' + parts[1].slice(0, 2);
    input.value = val;
    (this.skusArray.at(si) as FormGroup)
      .get('price')
      ?.setValue(val === '' ? null : Number(val), { emitEvent: false });
    (this.skusArray.at(si) as FormGroup).get('price')?.markAsTouched();
  }

  onSizeInput(event: Event, si: number): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(
      /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
      ''
    );
    val = val.replace(/[^A-Za-z0-9\s\-().,'"/]/g, '');
    input.value = val;
    (this.skusArray.at(si) as FormGroup)
      .get('size')
      ?.setValue(val, { emitEvent: false });
    (this.skusArray.at(si) as FormGroup).get('size')?.markAsTouched();
  }

  onSizeNumberInput(event: Event, si: number): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
    input.value = val;
    (this.skusArray.at(si) as FormGroup)
      .get('size')
      ?.setValue(val === '' ? null : Number(val), { emitEvent: false });
    (this.skusArray.at(si) as FormGroup).get('size')?.markAsTouched();
  }

  onKeydownNumeric(event: KeyboardEvent): void {
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === '-'
    ) {
      event.preventDefault();
    }
  }

  isInvalid(field: string): boolean {
    const c = this.productForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  isSkuInvalid(i: number, field: string): boolean {
    const c = (this.skusArray.at(i) as FormGroup).get(field);
    return !!(c?.invalid && c?.touched);
  }

  getSkuError(i: number, field: string): string {
    const ctrl = (this.skusArray.at(i) as FormGroup).get(field);
    if (!ctrl?.touched) return '';
    if (ctrl.hasError('required')) return 'This field is required.';
    if (ctrl.hasError('min')) return 'Value must be at least 1.';
    if (ctrl.hasError('emojiNotAllowed')) return 'Emojis are not allowed.';
    if (ctrl.hasError('invalidChars')) return 'Invalid characters used.';
    return '';
  }

  getFieldError(field: string): string {
    const ctrl = this.productForm.get(field);
    if (!ctrl?.touched) return '';
    if (ctrl.hasError('required')) return 'This field is required.';
    if (ctrl.hasError('maxlength')) return 'Too long.';
    if (ctrl.hasError('emojiNotAllowed')) return 'Emojis are not allowed.';
    if (ctrl.hasError('invalidChars'))
      return 'Only letters, numbers and basic punctuation allowed.';
    if (ctrl.hasError('invalidSlug'))
      return 'Slug must be lowercase letters, numbers and hyphens only (e.g. my-product).';
    return '';
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const fv = this.productForm.value;

    const payload = {
      productId: fv.productId,
      productName: fv.productName,
      slug: fv.slug ?? '',
      statusId: Number(fv.statusId),
      subCategoryId: fv.subCategoryId,
      details: fv.details ?? '',
      imageUrl: this.productImageBase64 ?? '',
      productSkus: fv.productSkus.map((sku: any, si: number) => ({
        skusId: sku.skusId,
        weightValue: sku.weightValue ? Number(sku.weightValue) : null,
        weightUnitId: Number(sku.weightUnitId),
        size: String(sku.size ?? ''),
        price: Number(sku.price),
        statusId: Number(sku.statusId),
        productImages: (sku.productImages ?? []).map(
          (img: any, ii: number) => ({
            productImageId: img.productImageId,
            imageUrl: this.skuImageBase64[si]?.[ii] ?? '',
          })
        ),
      })),
    };

    this.mainService.addProduct(payload).subscribe({
      next: (res: any) => {
        console.log(res);

        this.isSubmitting = false;
        if (res.meta?.status_code === 1) {
          this.toastr.success(res.meta.status_message, 'Success');
        }
        history.back();
      },
      error: (err) => {
        console.log(err);

        this.isSubmitting = false;
        this.toastr.error(
          err.meta.status_message,

          'Failed'
        );
      },
    });
  }

  goBack(): void {
    history.back();
  }
}
