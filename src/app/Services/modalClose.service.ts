import { Injectable, OnDestroy } from '@angular/core';
import { NgbModalRef, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalBackButtonService implements OnDestroy {
  private subscription: Subscription | null = null;
  private modalRef: NgbModalRef | null = null;

  register(modalRef: NgbModalRef) {
    this.modalRef = modalRef;

    history.pushState({ modal: true }, '');

    this.subscription = fromEvent<PopStateEvent>(window, 'popstate').subscribe(
      () => {
        if (this.modalRef) {
          this.modalRef.dismiss('back button');
          this.cleanup();
        }
      }
    );

    modalRef.result.finally(() => this.cleanup());
  }

  private cleanup() {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.modalRef = null;
  }

  ngOnDestroy() {
    this.cleanup();
  }
}
