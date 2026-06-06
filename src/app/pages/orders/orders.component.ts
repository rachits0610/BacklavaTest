import { Component, OnInit } from '@angular/core';
import { BreadcrumComponent } from '../../components/breadcrum/breadcrum.component';
import { AddFilterBtnComponent } from '../../components/add-filter-btn/add-filter-btn.component';
import { ReusableTableComponent } from '../../components/reusable-table/reusable-table.component';
import { MainService } from '../../Services/main.service';
import { OrderDetailComponent } from '../../Modals/order-detail/order-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from '../../Services/state.service';
import { Router } from '@angular/router';
import { ModalBackButtonService } from '../../Services/modalClose.service';
import { CancellationRequestAcceptRejectComponent } from '../../Modals/cancellation-request-accept-reject/cancellation-request-accept-reject.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [BreadcrumComponent, AddFilterBtnComponent, ReusableTableComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  apiLoading = false;

  allOrders: any[] = [];

  column: string[] = [
    'customerName',
    'phoneNumber',
    'totalCost',
    'discount',
    'finalAmount',
    'orderStatus',
    'paymentStatus',
    'createdAt',
  ];

  tableHeader: string[] = [
    'Customer Name',
    'Phone Number',
    'Total Cost',
    'Discount',
    'Final Amount',
    'Order Status',
    'Payment Status',
    'Created At',
  ];

  noOfData = 0;

  page = {
    pageNo: 1,
    pageSize: 10,
    search: '',
    startDate: '',
    endDate: '',
    orderStatusId: 0,
    paymentStatusId: 0,
  };
  paymentStatusDDL: any[] = [];
  orderStatusDDL: any[] = [];

  pageArr: number[] = [];

  isNextPageAvailable = false;

  constructor(
    private mainService: MainService,
    private modalService: NgbModal,
    private stateService: StateService,
    private router: Router,
    private modalBackButtonService: ModalBackButtonService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.stateService.setSidebarOpen(false);
    });
    this.loadOrders();
    this.getDDls();
  }
  getDDls() {
    this.mainService.getOrderStatusDDl().subscribe({
      next: (res: any) => {
        this.orderStatusDDL = res.data;
        // console.log(res);
      },
    });
    this.mainService.getPaymentStatusDDL().subscribe({
      next: (res: any) => {
        this.paymentStatusDDL = res.data;
        // console.log(res);
      },
    });
  }

  addOrders() {
    // console.log('Add Orders');
  }

  loadOrders() {
    this.apiLoading = true;

    const payload = {
      pageNo: this.page.pageNo,
      pageSize: this.page.pageSize,
      search: this.page.search,
      startDate: this.page.startDate,
      endDate: this.page.endDate,
      orderStatusId: this.page.orderStatusId,
      paymentStatusId: this.page.paymentStatusId,
    };

    this.mainService.getAllOrders(payload).subscribe({
      next: (res: any) => {
        this.apiLoading = false;

        this.allOrders = [];
        this.noOfData = 0;
        this.pageArr = [];
        this.isNextPageAvailable = false;

        if (res?.meta?.status_code === 1) {
          this.allOrders = res?.data?.orders || [];
          this.noOfData = res?.data?.totalRecords || 0;
          this.isNextPageAvailable = res?.data?.nextPageAvailable || false;

          const totalPages = res?.data?.totalPages || 0;
          this.pageArr = Array.from({ length: totalPages }, (_, i) => i + 1);
        }
      },
      error: (err: any) => {
        this.apiLoading = false;

        this.allOrders = [];
        this.noOfData = 0;
        this.pageArr = [];

        // console.log(err);
      },
    });
  }

  onPageChange(event: any) {
    this.page.pageNo = event;
    this.loadOrders();
  }

  openView(event: any) {
    // console.log('View Order', event);
    const modalRef = this.modalService.open(OrderDetailComponent, {
      centered: true,
      size: 'lg',
    });
    this.modalBackButtonService.register(modalRef);
    modalRef.componentInstance.orderId = event.orderId;
  }
  orderDetails: any;
  openEdit(event: any) {
    // this.getOrderDetails(event.orderId);
    this.openCancellationModal(event.orderId);
  }
  openCancellationModal(orderId: number): void {
    const ref = this.modalService.open(
      CancellationRequestAcceptRejectComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: 'static',
      }
    );
    ref.componentInstance.orderId = orderId;

    ref.result.then(
      (result) => {
        if (result === 'accepted' || result === 'rejected') {
          this.loadOrders();
        }
      },
      () => {}
    );
  }

  getOrderDetails(id: number) {
    this.mainService.getOrderDetailById(id).subscribe({
      next: (res: any) => {
        this.orderDetails = res.data;
      },
    });
  }

  openDelete(event: any) {
    // console.log('Delete Order', event);
  }

  filterData(event: any) {
    this.page.search = event.search;
    this.page.startDate = event.startDate;
    this.page.endDate = event.endDate;
    this.page.orderStatusId = +event.orderStatusId;
    this.page.paymentStatusId = +event.paymentStatusId;
    this.page.pageNo = 1;
    this.loadOrders();
  }
}
