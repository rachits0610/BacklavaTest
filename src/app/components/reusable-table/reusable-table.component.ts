import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ReusableFilterComponent } from '../reusable-filter/reusable-filter.component';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.css'],
})
export class ReusableTableComponent implements OnInit {
  @Input() headers: string[] = [];
  @Input() tableHead: any[] = [];
  @Input() data: any[] = [];
  @Input() totalCount: number = 0;

  @Input() addbtnLabel: string = '';
  @Input() tableTitle: string = '';
  @Input() showAddBtn: boolean = true;
  @Input() showFilterBtn: boolean = true;

  @Input() loading: boolean = false;

  @Input() showActions: boolean = false;
  @Input() showView: boolean = false;
  @Input() showEdit: boolean = false;
  @Input() showDelete: boolean = false;

  @Input() pageNo: number = 1;
  @Input() pageSize: number = 10;
  @Input() noOfData: number = 0;
  @Input() pageArr: number[] = [];
  @Input() isNextPageAvailable: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() filterData = new EventEmitter();

  popoverRow: any = null;
  popoverOpenUpward = false;

  private static readonly ACTIVE_VALUES = new Set([
    'active',
    'paid',
    'confirmed',
    'approved',
    'completed',
    'success',
    'delivered',
    'refunded',
    'shipped',
    'delivered',
  ]);

  private static readonly INACTIVE_VALUES = new Set([
    'inactive',
    'disabled',
    'rejected',
    'unpublished',
    'cancelled',
    'failed',
  ]);

  private static readonly NEUTRAL_VALUES = new Set([
    'pending',
    'on hold',
    'review',
    'draft',
    'cancellation requested',
    'processing',
  ]);

  constructor(private ngbOffCanvas: NgbOffcanvas) {}

  ngOnInit() {}

  openAddCategory() {
    this.onAdd.emit();
  }
  categoryView(row: any) {
    this.onView.emit(row);
  }
  categoryEdit(row: any) {
    this.onEdit.emit(row);
  }
  categoryDelete(row: any) {
    this.onDelete.emit(row);
  }

  isBool(val: any): boolean {
    return typeof val === 'boolean';
  }

  isObject(val: any): boolean {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }

  isStatusValue(val: any): boolean {
    if (typeof val !== 'string') return false;
    const lower = val.toLowerCase().trim();
    return (
      ReusableTableComponent.ACTIVE_VALUES.has(lower) ||
      ReusableTableComponent.INACTIVE_VALUES.has(lower) ||
      ReusableTableComponent.NEUTRAL_VALUES.has(lower)
    );
  }

  getStatusClass(val: string): string {
    const lower = val.toLowerCase().trim();
    if (ReusableTableComponent.ACTIVE_VALUES.has(lower))
      return 'rt-pill-active';
    if (ReusableTableComponent.INACTIVE_VALUES.has(lower))
      return 'rt-pill-inactive';
    if (ReusableTableComponent.NEUTRAL_VALUES.has(lower))
      return 'rt-pill-neutral';
    return 'rt-pill-neutral';
  }

  togglePopover(row: any, event: MouseEvent) {
    event.stopPropagation();

    if (this.popoverRow === row) {
      this.popoverRow = null;
      return;
    }

    const trigger = event.currentTarget as HTMLElement;
    const triggerRect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const popoverHeight = 120;

    this.popoverOpenUpward =
      spaceBelow < popoverHeight && spaceAbove > spaceBelow;
    this.popoverRow = row;
  }

  @HostListener('document:click')
  closePopover() {
    this.popoverRow = null;
  }

  openFilter() {
    const canvRef = this.ngbOffCanvas.open(ReusableFilterComponent, {
      position: 'end',
    });
    canvRef.result.then((result) => {
      this.filterData.emit(result);
    });
  }
}
