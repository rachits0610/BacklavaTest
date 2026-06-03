import { Component, OnInit } from '@angular/core';
import { BreadcrumComponent } from '../../components/breadcrum/breadcrum.component';
import { AddFilterBtnComponent } from '../../components/add-filter-btn/add-filter-btn.component';

import { MainService } from '../../Services/main.service';

import { ActivatedRoute, Router } from '@angular/router';
import { ReusableTableComponent } from '../../components/reusable-table/reusable-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReusableDeleteModalComponent } from '../../Modals/reusable-delete-modal/reusable-delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { StateService } from '../../Services/state.service';
import { ModalBackButtonService } from '../../Services/modalClose.service';

@Component({
  selector: 'app-products',
  imports: [BreadcrumComponent, AddFilterBtnComponent, ReusableTableComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  constructor(
    private mainService: MainService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private stateService: StateService,
    private modalBackButtonService: ModalBackButtonService
  ) {}
  apiLoading = false;

  column = ['productName', 'subCategoryName', 'statusName'];

  tableHeader = ['Product Name', 'Sub Category Name', 'Status Name'];

  Products: any[] = [];

  page: {
    pageNo: number;
    pageSize: number;
    search: string;
    startDate: string;
    endDate: string;
    statusId: number;
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
  ngOnInit(): void {
    setTimeout(() => {
      this.stateService.setSidebarOpen(false);
    });
    this.loadProducts();
  }
  loadProducts() {
    this.stateService.shimmerLoader$.subscribe(
      (res: boolean) => (this.apiLoading = res)
    );

    this.stateService.shimmerLoaderUpdate(true);
    this.mainService.getAllProducts(this.page).subscribe({
      next: (res: any) => {
        this.Products = res.data.list;
        this.noOfData = res.data.noOfData;
        this.isNextPageAvailable = res.data.nextPageAvailable;

        this.stateService.shimmerLoaderUpdate(false);

        this.apiLoading = false;
        this.buildPageArr();
      },
      error: (err) => {
        this.stateService.shimmerLoaderUpdate(false);
      },
    });
  }

  addProduct() {
    this.router.navigate(['add-product'], { relativeTo: this.route });
  }

  onPageChange(event: number) {
    this.page.pageNo = event;
    console.log(event);

    this.Products = [];
    this.loadProducts();
  }
  buildPageArr() {
    const totalPages = Math.ceil(this.noOfData / this.page.pageSize) || 1;
    this.pageArr = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  openView(event: Event) {
    console.log(event);
  }
  openEdit(event: Event) {
    this.router.navigate(['add-product'], {
      relativeTo: this.route,
      state: { product: event },
    });
  }
  openDelete(event: any) {
    const modalRef = this.modalService.open(ReusableDeleteModalComponent, {
      backdrop: false,
      centered: false,
      size: 'md',
    });
    this.modalBackButtonService.register(modalRef);
    modalRef.componentInstance.id = event.productId;
    modalRef.componentInstance.title = 'Delete Product';
    modalRef.componentInstance.message =
      'Do You Really Want to Delete This Product';
    modalRef.result.then((result) => {
      console.log(result);
      this.mainService.deleteProductById(result).subscribe({
        next: (res: any) => {
          if (res.meta.status_code === 1) {
            this.toastr.success('Product Deleted Successfully', 'Success');
            this.loadProducts();
          }
        },
      });
    });
  }
  filterData(event: any) {
    this.page.search = event.search;
    this.page.startDate = event.startDate;
    this.page.endDate = event.endDate;
    this.page.statusId = +event.statusId;
    this.loadProducts();
  }
}
