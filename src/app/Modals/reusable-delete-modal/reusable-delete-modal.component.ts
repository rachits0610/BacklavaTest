import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reusable-delete-modal',
  imports: [],
  templateUrl: './reusable-delete-modal.component.html',
  styleUrl: './reusable-delete-modal.component.css',
})
export class ReusableDeleteModalComponent {
  constructor(private activeModal: NgbActiveModal) {}
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() id: number = 0;
  cancel() {
    this.activeModal.dismiss();
  }
  confirm() {
    this.activeModal.close(this.id);
  }
}
