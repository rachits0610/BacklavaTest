import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterService } from '../../Services/master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-modal',
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
})
export class DeleteModalComponent {
  @Input() itemName: string = 'Category';
  @Input() itemId: number = 0;

  @Output() deleteEvent = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private masterService: MasterService,
    private toastrService: ToastrService
  ) {}

  onDelete(): void {
    this.masterService.deleteCategory(this.itemId).subscribe({
      next: (res: any) => {
        this.activeModal.close(res.meta.status_code);
        this.toastrService.success(res.meta.status_message, 'Success');
      },
      error: (err) => {
        this.activeModal.dismiss();
        this.toastrService.error(err.meta.status_code, 'Error');
      },
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
