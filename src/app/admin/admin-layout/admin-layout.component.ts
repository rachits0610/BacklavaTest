import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/authService';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { StateService } from '../../Services/state.service';
import { Subject, takeUntil } from 'rxjs';

const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  isMobile = false;
  sidebarOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.stateService.sidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.sidebarOpen = val;
      });

    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    if (this.isMobile && !wasMobile) {
      this.stateService.setSidebarOpen(false);
    }
  }

  toggleSidebar(): void {
    this.stateService.toggleSidebar();
  }

  closeSidebar(): void {
    this.stateService.setSidebarOpen(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
