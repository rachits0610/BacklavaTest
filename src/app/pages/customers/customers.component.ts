import { Component, OnInit } from '@angular/core';
import { BreadcrumComponent } from '../../components/breadcrum/breadcrum.component';
import { ReusableTableComponent } from '../../components/reusable-table/reusable-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../../Services/main.service';
import { AddFilterBtnComponent } from '../../components/add-filter-btn/add-filter-btn.component';
import { AddNewCustomerComponent } from '../../Modals/add-new-customer/add-new-customer.component';
import { MasterService } from '../../Services/master.service';
import { ReusableDeleteModalComponent } from '../../Modals/reusable-delete-modal/reusable-delete-modal.component';
import { StateService } from '../../Services/state.service';
import { ModalBackButtonService } from '../../Services/modalClose.service';

@Component({
  selector: 'app-customers',
  imports: [BreadcrumComponent, ReusableTableComponent, AddFilterBtnComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent implements OnInit {
  column = ['fullName', 'email', 'phoneNumber', 'statusName'];
  tableHead = ['Full Name', 'Email', 'Phone Number', 'Status'];

  customers: any[] = [];
  apiLoading = false;

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

  pageNo = 1;
  pageSize = 10;
  noOfData = 0;
  pageArr: number[] = [];
  isNextPageAvailable = false;

  constructor(
    private mainService: MainService,
    private modalService: NgbModal,
    private masterService: MasterService,
    private stateService: StateService,
    private modalBackButtonService: ModalBackButtonService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.stateService.setSidebarOpen(false);
    });
    this.loadAllCustomers(this.page);
  }

  loadAllCustomers(page: any) {
    this.apiLoading = true;
    this.mainService.getAllCustomers(page).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.customers = data.list ?? [];
        this.noOfData = data.noOfData ?? 0;
        this.pageNo = data.pageNo ?? page;
        this.isNextPageAvailable = data.nextPageAvailable ?? false;
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

  openModal(mode: 'add' | 'edit' | 'view', rowData?: any) {
    console.log(rowData);

    const labels: Record<string, string> = {
      add: 'Add Customer',
      edit: 'Edit Customer',
      view: 'View Customer',
    };

    const modalRef = this.modalService.open(AddNewCustomerComponent, {
      centered: false,
      backdrop: true,
    });
    this.modalBackButtonService.register(modalRef);

    modalRef.componentInstance.modalHeading = labels[mode];
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.existingData = rowData ?? null;

    modalRef.result
      .then((result) => {
        if (result === 1) this.loadAllCustomers(this.page);
      })
      .catch((reason) => console.log('Modal dismissed:', reason));
  }

  addCustomer() {
    this.openModal('add');
  }

  openView(row: any) {
    this.openModal('view', row);
  }

  openEdit(row: any) {
    this.openModal('edit', row);
  }

  openDelete(row: any) {
    console.log(row);

    const modalRef = this.modalService.open(ReusableDeleteModalComponent, {
      backdrop: true,
      centered: false,
      size: 'md',
    });
    this.modalBackButtonService.register(modalRef);
    modalRef.componentInstance.id = row.userId;
    modalRef.componentInstance.title = 'Delete Customer';
    modalRef.componentInstance.message =
      'Do You Really Want to Delete This Customer';
    modalRef.result.then((result) => {
      console.log(result);
      this.masterService.deleteCustomer(row.userId).subscribe({
        next: (res: any) => {
          if (res.meta.status_code === 1) {
            this.loadAllCustomers(this.page);
          }
        },
      });
    });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.pageArr.length) return;
    this.page.pageNo = page;
    this.customers = [];
    this.loadAllCustomers(this.page);
  }

  filterData(event: any) {
    this.page.search = event.search;
    this.page.startDate = event.startDate;
    this.page.endDate = event.endDate;
    this.page.statusId = +event.statusId;
    this.loadAllCustomers(this.page);
  }
}
