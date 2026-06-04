import {
  Component,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Services/authService';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MenuSection } from '../../models/model';
import { StateService } from '../../Services/state.service';
import { Subject, takeUntil } from 'rxjs';

const MOBILE_BREAKPOINT = 668;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isMobile = false;

  isExpanded = false;
  private destroy$ = new Subject<void>();

  menuSections: MenuSection[] = [
    {
      section: 'Main',
      items: [
        {
          label: 'Dashboard',
          icon: 'fa-solid fa-gauge',
          route: '/admin/dashboard',
        },
        {
          label: 'Products',
          icon: 'fa-solid fa-box',
          route: '/admin/products',
        },
        {
          label: 'Orders',
          icon: 'fa-solid fa-cart-shopping',
          route: '/admin/orders',
        },
        {
          label: 'Payments',
          icon: 'fa-solid fa-credit-card',
          route: '/admin/payments',
        },
        {
          label: 'Customers',
          icon: 'fa-solid fa-users',
          route: '/admin/customers',
        },
      ],
    },
    {
      section: 'Master',
      items: [
        {
          label: 'Category',
          icon: 'fa-solid fa-layer-group',
          route: '/admin/master/category',
        },
        {
          label: 'SubCategory',
          icon: 'fa-solid fa-sitemap',
          route: '/admin/master/sub-category',
        },
        {
          label: 'User Subscribed',
          icon: 'fa-solid fa-crown',
          route: '/admin/master/subscribed',
        },
        {
          label: 'Users Contacted',
          icon: 'fa-solid fa-address-book',
          route: '/admin/master/contacted',
        },
      ],
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.stateService.sidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => (this.isExpanded = val));
  }

  // Desktop hover — ignored on mobile
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.isMobile && window.innerWidth >= MOBILE_BREAKPOINT) {
      this.stateService.setSidebarOpen(true);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.isMobile && window.innerWidth >= MOBILE_BREAKPOINT) {
      this.stateService.setSidebarOpen(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
