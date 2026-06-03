// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

// export interface DropdownOption {
//   statusName: string;
//   statusId: number;
//   paymentStatusId: number;
//   orderStatusId: number;
// }

// export interface PaymentOrderFilter {
//   search: string;
//   startDate: string;
//   endDate: string;
//   paymentStatusId: number;
//   orderStatusId: number;
// }

// @Component({
//   selector: 'app-filter-payment-and-order',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './filter-payment-and-order.component.html',
//   styleUrl: './filter-payment-and-order.component.css',
// })
// export class FilterPaymentAndOrderComponent implements OnInit {
//   @Input() ShowOrderStatus = true;
//   @Input() paymentStatusOptions: DropdownOption[] = [];

//   @Input() orderStatusOptions: DropdownOption[] = [];

//   @Output() applyPayment = new EventEmitter<PaymentOrderFilter>();

//   @Output() clearPayment = new EventEmitter<void>();

//   filters: PaymentOrderFilter = {
//     search: '',
//     startDate: '',
//     endDate: '',
//     paymentStatusId: 0,
//     orderStatusId: 0,
//   };

//   constructor(private activeOffCanvas: NgbActiveOffcanvas) {}

//   ngOnInit(): void {
//     console.log(this.paymentStatusOptions);
//     console.log(this.orderStatusOptions);
//     console.log(this.ShowOrderStatus);
//   }

//   onApply(): void {
//     this.applyPayment.emit({ ...this.filters });
//     this.activeOffCanvas.close({ ...this.filters });
//   }

//   onClose(): void {
//     this.activeOffCanvas.dismiss();
//   }

//   onClear(): void {
//     this.filters = {
//       search: '',
//       startDate: '',
//       endDate: '',
//       paymentStatusId: 0,
//       orderStatusId: 0,
//     };

//     this.clearPayment.emit();
//     this.activeOffCanvas.close({ ...this.filters });
//   }
// }

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface DropdownOption {
  statusName: string;
  statusId: number;
  paymentStatusId: number;
  orderStatusId: number;
}

export interface PaymentOrderFilter {
  search: string;
  startDate: string;
  endDate: string;
  paymentStatusId: number;
  orderStatusId: number;
}

@Component({
  selector: 'app-filter-payment-and-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-payment-and-order.component.html',
  styleUrl: './filter-payment-and-order.component.css',
})
export class FilterPaymentAndOrderComponent implements OnInit, OnDestroy {
  @Input() ShowOrderStatus = true;
  @Input() paymentStatusOptions: DropdownOption[] = [];
  @Input() orderStatusOptions: DropdownOption[] = [];

  @Output() applyPayment = new EventEmitter<PaymentOrderFilter>();
  @Output() clearPayment = new EventEmitter<void>();

  filters: PaymentOrderFilter = {
    search: '',
    startDate: '',
    endDate: '',
    paymentStatusId: 0,
    orderStatusId: 0,
  };

  private routerSub!: Subscription;
  private popstateSub!: Subscription;
  private isClosing = false;

  constructor(
    private activeOffCanvas: NgbActiveOffcanvas,
    private router: Router
  ) {}

  ngOnInit(): void {
    history.pushState(null, '', window.location.href);

    this.popstateSub = new Subscription();
    const popstateHandler = () => {
      if (this.isClosing) return;
      history.pushState(null, '', window.location.href);
      this.closeOffcanvas();
    };
    window.addEventListener('popstate', popstateHandler);
    this.popstateSub.add(() =>
      window.removeEventListener('popstate', popstateHandler)
    );

    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => {
        if (!this.isClosing) {
          this.closeOffcanvas();
        }
      });
  }

  private closeOffcanvas(): void {
    this.isClosing = true;
    this.activeOffCanvas.dismiss();
  }

  onApply(): void {
    this.isClosing = true;
    this.applyPayment.emit({ ...this.filters });
    this.activeOffCanvas.close({ ...this.filters });
  }

  onClose(): void {
    this.isClosing = true;
    this.activeOffCanvas.dismiss();
  }

  onClear(): void {
    this.isClosing = true;
    this.filters = {
      search: '',
      startDate: '',
      endDate: '',
      paymentStatusId: 0,
      orderStatusId: 0,
    };
    this.clearPayment.emit();
    this.activeOffCanvas.close({ ...this.filters });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.popstateSub?.unsubscribe();
  }
}
