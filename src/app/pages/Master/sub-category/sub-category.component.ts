import { Component, OnInit } from '@angular/core';
import { BreadcrumComponent } from '../../../components/breadcrum/breadcrum.component';
import { ReusableTableComponent } from '../../../components/reusable-table/reusable-table.component';
import { MasterService } from '../../../Services/master.service';
import { AddFilterBtnComponent } from '../../../components/add-filter-btn/add-filter-btn.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSubcategoryComponent } from '../../../Modals/add-subcategory/add-subcategory.component';
import { StateService } from '../../../Services/state.service';
import { FilterValues } from '../../../models/model';
import { ReusableDeleteModalComponent } from '../../../Modals/reusable-delete-modal/reusable-delete-modal.component';
import { ModalBackButtonService } from '../../../Services/modalClose.service';

@Component({
  selector: 'app-sub-category',
  imports: [BreadcrumComponent, ReusableTableComponent, AddFilterBtnComponent],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.css',
})
export class SubCategoryComponent implements OnInit {
  constructor(
    private masterService: MasterService,
    private modalService: NgbModal,
    private stateService: StateService,
    private modalBackButtonService: ModalBackButtonService
  ) {}
  column = ['subCategoryName', 'categoryName', 'statusName'];
  tableHeader = ['Sub Category Name', 'Category Name', 'Status Name'];
  categoryDDl: any[] = [];

  data: any[] = [];
  apiLoading = false;

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
  noOfData = 0;
  pageArr: number[] = [];
  isNextPageAvailable = false;
  subCategories: any[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.stateService.setSidebarOpen(false);
    });
    this.loadSubcategories();
    this.loadCategoriesDDl();
  }

  loadSubcategories() {
    this.stateService.shimmerLoader$.subscribe(
      (res: boolean) => (this.apiLoading = res)
    );
    this.stateService.shimmerLoaderUpdate(true);
    this.masterService.getAllSubCategories(this.page).subscribe({
      next: (res: any) => {
        this.subCategories = res.data.list;
        this.noOfData = res.data.noOfData;
        this.isNextPageAvailable = res.data.nextPageAvailable;
        this.stateService.shimmerLoaderUpdate(false);
        this.buildPageArr();
      },
    });
  }
  loadCategoriesDDl() {
    this.masterService.getCategoriesDDl().subscribe({
      next: (res: any) => {
        this.categoryDDl = res.data;
      },
    });
  }
  buildPageArr() {
    const totalPages = Math.ceil(this.noOfData / this.page.pageSize) || 1;
    this.pageArr = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  openModal(mode: 'add' | 'edit' | 'view', rowData?: any) {
    const labels: Record<string, string> = {
      add: 'Add SubCategory',
      edit: 'Edit SubCategory',
      view: 'View SubCategory',
    };

    const modalRef = this.modalService.open(AddSubcategoryComponent, {
      centered: false,
      backdrop: true,
    });
    this.modalBackButtonService.register(modalRef);

    modalRef.componentInstance.modalHeading = labels[mode];
    modalRef.componentInstance.categoryDDl = this.categoryDDl;
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.existingData = rowData ?? null;

    modalRef.result
      .then((result) => {
        if (result === 1) this.loadSubcategories();
      })
      .catch((reason) => console.log('Modal dismissed:', reason));
  }

  addSubCategory() {
    this.openModal('add');
  }
  openView(event: any) {
    this.openModal('view', event);
  }
  openEdit(event: any) {
    this.openModal('edit', event);
  }
  openDelete(event: any) {
    const modalRef = this.modalService.open(ReusableDeleteModalComponent, {
      centered: false,
      backdrop: true,
    });
    this.modalBackButtonService.register(modalRef);
    modalRef.componentInstance.title = 'Delete Sub-Category';
    modalRef.componentInstance.message =
      'Are you Sure You wnat to Delete This Subcategory';
    modalRef.componentInstance.id = event;
    modalRef.result.then((result) => {
      debugger;
      console.log(result);

      if (result) {
        console.log(result);

        this.masterService.deleteSubcategory(event.subCategoryId).subscribe({
          next: (res: any) => {
            if (res.meta.status_code === 1) {
              this.loadSubcategories();
            }
            console.log(res);
          },
        });
        this.loadSubcategories();
      }
    });
  }
  onPageChange(event: number) {
    this.page.pageNo = event;
    this.subCategories = [];
    this.loadSubcategories();
  }
  filterData(event: FilterValues) {
    console.log(event);
    this.page.search = event.search;
    this.page.startDate = event.startDate;
    this.page.endDate = event.endDate;
    this.page.statusId = +event.statusId;
    this.loadSubcategories();
  }
}
