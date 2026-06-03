import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent {
  @Input() order: any = {};

  constructor(private activeModal: NgbActiveModal) {}

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

  getStatusBadge(status: string): string {
    const s = status?.toLowerCase().trim();
    const green = ['confirmed', 'paid', 'completed', 'approved', 'success'];
    const yellow = ['pending', 'processing', 'on hold', 'review', 'draft'];
    const red = ['cancelled', 'failed', 'rejected', 'unpublished'];
    if (green.includes(s)) return 'od-badge-green';
    if (yellow.includes(s)) return 'od-badge-yellow';
    if (red.includes(s)) return 'od-badge-red';
    return 'od-badge-yellow';
  }

  toNumber(val: any): number {
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  }
}
