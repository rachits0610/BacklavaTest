import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService {
  private isShimmerLoading = new BehaviorSubject<boolean>(false);
  shimmerLoader$ = this.isShimmerLoading.asObservable();

  shimmerLoaderUpdate(value: boolean) {
    this.isShimmerLoading.next(value);
  }

  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this.isSidebarOpen.asObservable();

  setSidebarOpen(value: boolean) {
    this.isSidebarOpen.next(value);
  }

  toggleSidebar() {
    this.isSidebarOpen.next(!this.isSidebarOpen.getValue());
  }
}
