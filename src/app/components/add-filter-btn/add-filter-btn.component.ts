import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ReusableFilterComponent } from '../reusable-filter/reusable-filter.component';
import { FilterPaymentAndOrderComponent } from '../filter-payment-and-order/filter-payment-and-order.component';

@Component({
  selector: 'app-add-filter-btn',
  imports: [CommonModule],
  templateUrl: './add-filter-btn.component.html',
  styleUrl: './add-filter-btn.component.css',
})
export class AddFilterBtnComponent {
  @Input() addbtnLabel: string = '';
  @Input() showAddBtn = true;
  @Input() showFilterBtn = true;
  @Input() isOrderComp = false;
  @Input() showOrderStatus = true;
  @Input() paymentStatusDDl: any[] = [];
  @Input() orderStatusDDL: any[] = [];
  @Output() onAdd = new EventEmitter();
  @Output() onView = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onFilter = new EventEmitter();

  constructor(private ngbOffCanvas: NgbOffcanvas) {}

  openAdd() {
    this.onAdd.emit();
  }

  View(row: any) {
    this.onView.emit(row);
  }

  Edit(row: any) {
    this.onEdit.emit(row);
  }

  Delete(row: any) {
    this.onDelete.emit(row);
  }

  openFilter() {
    if (!this.isOrderComp) {
      const offCanvasRef = this.ngbOffCanvas.open(ReusableFilterComponent, {
        position: 'end',
      });
      offCanvasRef.result
        .then((result) => {
          this.onFilter.emit(result);
        })
        .catch(() => {
          // dismissed via back button or backdrop — do nothing
        });
    } else {
      const offCanvasRef = this.ngbOffCanvas.open(
        FilterPaymentAndOrderComponent,
        { position: 'end' }
      );
      offCanvasRef.componentInstance.paymentStatusOptions =
        this.paymentStatusDDl;
      offCanvasRef.componentInstance.orderStatusOptions = this.orderStatusDDL;
      offCanvasRef.componentInstance.ShowOrderStatus = this.showOrderStatus;
      offCanvasRef.result
        .then((result) => {
          this.onFilter.emit(result);
        })
        .catch(() => {
          // dismissed via back button or backdrop — do nothing
        });
    }
  }
}
