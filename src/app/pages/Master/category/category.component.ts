// import { Component, OnInit } from '@angular/core';
// import { ReusableTableComponent } from '../../../components/reusable-table/reusable-table.component';
// import { BreadcrumComponent } from '../../../components/breadcrum/breadcrum.component';
// import { MasterService } from '../../../Services/master.service';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { AddCategoryComponent } from '../../../Modals/add-category/add-category.component';
// import { DeleteModalComponent } from '../../../Modals/delete-modal/delete-modal.component';
// import { CategoryApiResponse, FilterValues } from '../../../models/model';
// import { AddFilterBtnComponent } from '../../../components/add-filter-btn/add-filter-btn.component';

// @Component({
//   selector: 'app-category',
//   imports: [ReusableTableComponent, BreadcrumComponent],
//   templateUrl: './category.component.html',
//   styleUrl: './category.component.css',
// })
// export class CategoryComponent implements OnInit {
//   column = ['categoryName', 'statusName'];
//   tableHead = ['Category Name', 'Status Name'];

//   data: any[] = [];
//   apiLoading = false;

//   pageNo = 1;
//   pageSize = 10;
//   noOfData = 0;
//   pageArr: number[] = [];
//   isNextPageAvailable = false;
//   search = '';

//   constructor(
//     private masterService: MasterService,
//     private modalService: NgbModal
//   ) {}

//   ngOnInit() {
//     this.loadCategories(this.pageNo);
//   }

//   openModal(mode: 'add' | 'edit' | 'view', row?: any) {
//     const modalRef = this.modalService.open(AddCategoryComponent, {
//       centered: false,
//       backdrop: 'static',
//       size: 'md',
//     });

//     modalRef.componentInstance.mode = mode;
//     modalRef.componentInstance.modalHeading =
//       mode === 'add'
//         ? 'Add Category'
//         : mode === 'edit'
//         ? 'Edit Category'
//         : 'View Category';

//     modalRef.componentInstance.ModalData = row
//       ? {
//           categoryId: row.categoryId ?? 0,
//           categoryName: row.categoryName ?? '',
//           statusId: row.statusId ?? 0,
//           statusName: row.statusName ?? 'active',
//         }
//       : { categoryId: 0, categoryName: '', statusId: 0, statusName: '' };

//     modalRef.result
//       .then((result) => {
//         if (result === 1) this.loadCategories(1);
//       })
//       .catch(() => {});
//   }

//   openDeleteModal(row: any) {
//     const modalRef = this.modalService.open(DeleteModalComponent, {
//       centered: true,
//       backdrop: 'static',
//       size: 'md',
//     });

//     modalRef.componentInstance.itemName = row.categoryName;
//     modalRef.componentInstance.itemId = row.categoryId;

//     modalRef.result
//       .then((result) => {
//         if (result === 1) this.loadCategories(1);
//       })
//       .catch(() => {});
//   }

//   loadCategories(page: number) {
//     this.apiLoading = true;
//     const payload = {
//       pageNo: page,
//       pageSize: this.pageSize,
//       search: this.search,
//       startDate: '',
//       statusId: 2,
//     };
//     this.masterService.getAllCategories(payload).subscribe({
//       next: (res) => {
//         const response = res as unknown as CategoryApiResponse;
//         const payload = response.data;
//         this.data = payload.list ?? [];
//         this.noOfData = payload.noOfData ?? 0;
//         this.pageNo = payload.pageNo ?? page;
//         this.isNextPageAvailable = payload.nextPageAvailable ?? false;
//         this.buildPageArr();
//         this.apiLoading = false;
//       },
//       error: (err) => {
//         console.error('API error:', err);
//         this.apiLoading = false;
//       },
//     });
//   }

//   buildPageArr() {
//     const totalPages = Math.ceil(this.noOfData / this.pageSize) || 1;
//     this.pageArr = Array.from({ length: totalPages }, (_, i) => i + 1);
//   }

//   applyFilter(event: FilterValues) {
//     console.log(event.startDate);
//     console.log(event.endDate);
//     console.log(event.search);
//     // console.log(event.size);
//     console.log(event.statusId);
//     this.search = event.search;
//     this.loadCategories(this.pageNo);
//   }

//   onPageChange(page: number) {
//     if (page < 1 || page > this.pageArr.length) return;
//     this.data = [];
//     this.loadCategories(page);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ReusableTableComponent } from '../../../components/reusable-table/reusable-table.component';
import { BreadcrumComponent } from '../../../components/breadcrum/breadcrum.component';
import { AddFilterBtnComponent } from '../../../components/add-filter-btn/add-filter-btn.component';
import { MasterService } from '../../../Services/master.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCategoryComponent } from '../../../Modals/add-category/add-category.component';
import { DeleteModalComponent } from '../../../Modals/delete-modal/delete-modal.component';
import { CategoryApiResponse, FilterValues } from '../../../models/model';
import { StateService } from '../../../Services/state.service';
import { ModalBackButtonService } from '../../../Services/modalClose.service';

@Component({
  selector: 'app-category',
  imports: [ReusableTableComponent, BreadcrumComponent, AddFilterBtnComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  column = ['categoryName', 'statusName'];
  tableHead = ['Category Name', 'Status Name'];

  data: any[] = [];
  apiLoading = false;

  pageNo = 1;
  pageSize = 10;
  noOfData = 0;
  pageArr: number[] = [];
  isNextPageAvailable = false;
  search = '';
  page: {
    pageNo: number;
    pageSize: number;
    search: string;
    startDate: string;
    endDate: string;
    statusId: number | string;
  } = {
    pageNo: 1,
    pageSize: 10,
    search: '',
    startDate: '',
    endDate: '',
    statusId: 2,
  };

  constructor(
    private masterService: MasterService,
    private modalService: NgbModal,
    private stateService: StateService,
    private modalBackButtonService: ModalBackButtonService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.stateService.setSidebarOpen(false);
    });
    this.loadCategories(this.page);
  }

  openModal(mode: 'add' | 'edit' | 'view', row?: any) {
    const modalRef = this.modalService.open(AddCategoryComponent, {
      centered: false,
      backdrop: true,
      size: 'md',
    });
    this.modalBackButtonService.register(modalRef);

    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.modalHeading =
      mode === 'add'
        ? 'Add Category'
        : mode === 'edit'
        ? 'Edit Category'
        : 'View Category';

    modalRef.componentInstance.ModalData = row
      ? {
          categoryId: row.categoryId ?? 0,
          categoryName: row.categoryName ?? '',
          statusId: row.statusId ?? 0,
          statusName: row.statusName ?? 'active',
        }
      : { categoryId: 0, categoryName: '', statusId: 0, statusName: '' };

    modalRef.result
      .then((result) => {
        if (result === 1) this.loadCategories(this.page);
      })
      .catch(() => {});
  }

  openDeleteModal(row: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: false,
      backdrop: true,
      size: 'md',
    });
    this.modalBackButtonService.register(modalRef);

    modalRef.componentInstance.itemName = row.categoryName;
    modalRef.componentInstance.itemId = row.categoryId;

    modalRef.result
      .then((result) => {
        if (result === 1) this.loadCategories(this.page);
      })
      .catch(() => {});
  }

  loadCategories(page: any) {
    this.apiLoading = true;
    this.masterService.getAllCategories(page).subscribe({
      next: (res) => {
        const response = res as unknown as CategoryApiResponse;
        const payload = response.data;
        this.data = payload.list ?? [];
        this.noOfData = payload.noOfData ?? 0;
        this.pageNo = payload.pageNo ?? page;
        this.isNextPageAvailable = payload.nextPageAvailable ?? false;
        this.buildPageArr();
        this.apiLoading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.apiLoading = false;
      },
    });
  }

  buildPageArr() {
    const totalPages = Math.ceil(this.noOfData / this.pageSize) || 1;
    this.pageArr = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  applyFilter(event: FilterValues) {
    console.log(event);
    this.page.startDate = event.startDate;
    this.page.endDate = event.endDate;
    this.page.statusId = +event.statusId;

    this.search = event.search;
    this.loadCategories(this.page);
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.pageArr.length) return;
    this.data = [];
    this.loadCategories(page);
  }
}
