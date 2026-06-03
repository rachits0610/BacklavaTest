import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumComponent } from '../../components/breadcrum/breadcrum.component';
import { AddFilterBtnComponent } from '../../components/add-filter-btn/add-filter-btn.component';
import { ReusableTableComponent } from '../../components/reusable-table/reusable-table.component';
import { MainService } from '../../Services/main.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentDetailComponent } from '../../Modals/payment-detail/payment-detail.component';
import { StateService } from '../../Services/state.service';
import { ModalBackButtonService } from '../../Services/modalClose.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumComponent,
    AddFilterBtnComponent,
    ReusableTableComponent,
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class PaymentsComponent implements OnInit {
  column = [
    'customerName',
    'customerEmail',
    'customerPhone',
    'amount',
    'paymentMode',

    'paymentCreatedAt',
    'paymentStatus',
  ];
  tableHead = [
    'Customer',
    'Email',
    'Phone',
    'Amount ',
    'Mode',

    'Created At',
    'Status',
  ];

  payments: any[] = [];
  apiLoading = false;
  paymentStatusDDL: any[] = [];

  page = {
    pageNo: 1,
    pageSize: 10,
    search: '',
    paymentStatusId: 0,
    paymentMode: '',
    provider: '',
    startDate: '',
    endDate: '',
  };

  noOfData = 0;
  pageArr: number[] = [];
  isNextPageAvailable = false;

  constructor(
    private mainService: MainService,
    private modalService: NgbModal,
    private stateService: StateService,
    private modalBackButtonService: ModalBackButtonService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.stateService.setSidebarOpen(false);
    });
    this.loadPayments();
  }

  loadPayments(): void {
    this.apiLoading = true;
    this.mainService.getAllPayments(this.page).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.payments = data.list ?? [];
        this.noOfData = data.noOfData ?? 0;
        this.page.pageNo = data.pageNo ?? this.page.pageNo;
        this.isNextPageAvailable = data.nextPageAvailable ?? false;
        this.buildPageArr();
        this.apiLoading = false;
      },
      error: (err) => {
        console.error('Payments API error:', err);
        this.apiLoading = false;
      },
    });
    this.getDDls();
  }
  getDDls() {
    this.mainService.getPaymentStatusDDL().subscribe({
      next: (res: any) => {
        this.paymentStatusDDL = res.data;
        console.log(res);
      },
    });
  }

  buildPageArr(): void {
    const totalPages = Math.ceil(this.noOfData / this.page.pageSize) || 1;
    this.pageArr = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.pageArr.length) return;
    this.page.pageNo = page;
    this.payments = [];
    this.loadPayments();
  }

  // filterData(event: any): void {
  //   console.log(event);

  //   this.page.search = event.search ?? '';
  //   this.page.startDate = event.startDate ?? '';
  //   this.page.endDate = event.endDate ?? '';

  //   if (event.statusId !== undefined) {
  //     this.page.paymentStatusId = +event.statusId;
  //   }
  //   this.page.pageNo = 1;
  //   this.loadPayments();
  // }
  filterData(event: any): void {
    console.log(event);

    this.page.search = event.search ?? '';
    this.page.startDate = event.startDate ?? '';
    this.page.endDate = event.endDate ?? '';

    this.page.paymentStatusId = Number(event.paymentStatusId ?? 0);

    this.page.pageNo = 1;

    console.log('Payload:', this.page);

    this.loadPayments();
  }
  addPayment(): void {}
  openViewPage(event: any) {
    console.log(event);
    const modalRef = this.modalService.open(PaymentDetailComponent, {
      backdrop: true,
      centered: true,
      size: 'lg',
    });
    this.modalBackButtonService.register(modalRef);
    modalRef.componentInstance.payment = event;
  }
}
