import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../../Services/main.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  @Input() orderId!: number;

  order: any = null;
  loading = false;
  error = '';

  constructor(
    private activeModal: NgbActiveModal,
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

  onClose(): void {
    this.activeModal.dismiss();
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .trim()
      .split(' ')
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getStatusClass(status: string): string {
    const s = status?.toLowerCase().trim();
    const green = [
      'confirmed',
      'paid',
      'completed',
      'approved',
      'success',
      'delivered',
      'refunded',
    ];
    const red = ['cancelled', 'failed', 'rejected', 'unpublished'];
    if (green.includes(s)) return 'badge--green';
    if (red.includes(s)) return 'badge--red';
    return 'badge--yellow';
  }

  trackByItem(_: number, item: any): number {
    return item.orderItemsId;
  }
}
