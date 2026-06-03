import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css',
})
export class PaymentDetailComponent {
  @Input() payment: any = {};

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
}
