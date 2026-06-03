// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, Input, Output } from '@angular/core';

// @Component({
//   selector: 'app-pagination',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './pagination.component.html',
//   styleUrls: ['./pagination.component.less'],
// })
// export class PaginationComponent {
//   @Input() pageNo: number = 1;
//   @Input() pageSize: number = 10;
//   @Input() noOfData: number = 0;
//   @Input() listLength: number = 0;
//   @Input() isNextPageAvailable: boolean = false;
//   @Input() pageArr: number[] = [];
//   @Output() getPageData = new EventEmitter<number>();
// }
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less'],
})
export class PaginationComponent implements OnChanges {
  @Input() pageNo: number = 1;
  @Input() pageSize: number = 10;
  @Input() noOfData: number = 0;
  @Input() listLength: number = 0;
  @Input() isNextPageAvailable: boolean = false;
  @Input() pageArr: number[] = [];

  @Output() getPageData = new EventEmitter<number>();

  visiblePages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageArr'] || changes['pageNo']) {
      this.updateVisiblePages();
    }
  }

  private updateVisiblePages(): void {
    const total = this.pageArr.length;

    if (total <= 5) {
      this.visiblePages = [...this.pageArr];
      return;
    }

    const currentIndex = this.pageArr.indexOf(this.pageNo);

    let start = Math.max(0, currentIndex - 2);
    let end = start + 5;

    // Clamp end to array bounds and shift start back if needed
    if (end > total) {
      end = total;
      start = end - 5;
    }

    this.visiblePages = this.pageArr.slice(start, end);
  }
}
