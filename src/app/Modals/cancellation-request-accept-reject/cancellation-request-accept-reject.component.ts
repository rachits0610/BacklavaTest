import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../../Services/main.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-cancellation-request-accept-reject',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancellation-request-accept-reject.component.html',
  styleUrl: './cancellation-request-accept-reject.component.css',
})
export class CancellationRequestAcceptRejectComponent implements OnInit {
  @Input() orderId!: number;
  baseUrl = environment.BaseURL;

  order: any = null;
  loading = false;
  actionLoading = false;
  error = '';
  confirmed: 'accepted' | 'rejected' | null = null;
  @Output() requestResult = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private mainService: MainService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    this.loading = true;
    this.mainService.getOrderDetailById(this.orderId).subscribe({
      next: (res: any) => {
        this.order = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load order details.';
        this.loading = false;
      },
    });
  }
  acc = 1;
  rej = 0;

  actionError = '';
  accept(): void {
    this.actionLoading = true;
    this.actionError = '';
    this.mainService
      .cancelOrder({ orderId: this.orderId, status: 1 })
      .subscribe({
        next: () => {
          this.actionLoading = false;
          this.confirmed = 'accepted';
        },
        error: () => {
          this.actionLoading = false;
          this.actionError = 'Failed to accept cancellation. Please try again.';
        },
      });
    this.requestResult.emit();
  }

  reject(): void {
    this.actionLoading = true;
    this.actionError = '';
    this.mainService
      .cancelOrder({ orderId: this.orderId, status: 0 })
      .subscribe({
        next: () => {
          this.actionLoading = false;
          this.confirmed = 'rejected';
        },
        error: () => {
          this.actionLoading = false;
          this.actionError = 'Failed to reject cancellation. Please try again.';
        },
      });
    this.requestResult.emit();
  }
  close(): void {
    this.activeModal.close(this.confirmed);
  }
  closeModal() {
    this.activeModal.dismiss();
  }

  get subtotal(): number {
    return (this.order?.items ?? []).reduce(
      (s: number, i: any) => s + i.totalPrice,
      0
    );
  }
  get isCancellationRequested(): boolean {
    return (
      this.order?.status?.orderStatus?.toLowerCase().trim() ===
      'cancellation requested'
    );
  }

  trackByItem(_: number, item: any): number {
    return item.orderItemsId;
  }
}
