import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FilterValues } from '../../models/model';

@Component({
  selector: 'app-reusable-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reusable-filter.component.html',
  styleUrl: './reusable-filter.component.css',
})
export class ReusableFilterComponent implements OnInit, OnDestroy {
  @Input() showSize: boolean = true;
  @Input() showStatus: boolean = true;
  @Input() showDateRange: boolean = true;
  @Input() searchPlaceholder: string = 'Search...';

  @Output() apply = new EventEmitter<FilterValues>();
  @Output() clear = new EventEmitter<void>();

  private routerSub!: Subscription;
  private popstateSub!: Subscription;
  private isClosing = false;

  filters: FilterValues = {
    search: '',
    startDate: '',
    endDate: '',
    statusId: 1,
  };

  constructor(
    private activeOffCanvas: NgbActiveOffcanvas,
    private router: Router,
    private location: Location
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
    this.apply.emit({ ...this.filters });
    this.activeOffCanvas.close({ ...this.filters });
  }

  onClose(): void {
    this.isClosing = true;
    this.activeOffCanvas.close(this.filters);
  }

  onClear(): void {
    this.isClosing = true;
    this.filters = {
      search: '',
      startDate: '',
      endDate: '',
      statusId: 2,
    };
    this.clear.emit();
    this.activeOffCanvas.close({ ...this.filters });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.popstateSub?.unsubscribe();
  }
}
