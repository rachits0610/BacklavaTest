import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/authService';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../Services/storage.service';
import { StateService } from '../../Services/state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePsswordModalComponent } from '../../Modals/change-pssword-modal/change-pssword-modal.component';
import { AddNewUserComponent } from '../../Modals/add-new-user/add-new-user.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() showHamburger = false;
  @Output() hamburgerClick = new EventEmitter<void>();

  dropdownOpen = false;
  userName = '';
  userRole = '';

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private stateService: StateService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    const data = this.storageService.getItem('crm_user');
    if (data) {
      const userDetail = JSON.parse(data);
      this.userName = userDetail?.adminName || '';
    }
    this.userRole = 'Admin';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }

  onHamburgerClick(): void {
    this.hamburgerClick.emit();
    this.dropdownOpen = false; 
  }

  toggleDropdown(): void {

    this.stateService.setSidebarOpen(false);
    this.dropdownOpen = !this.dropdownOpen;
  }

  openChangePassword(): void {
    this.dropdownOpen = false;
    this.modalService.open(ChangePsswordModalComponent, {
      size: 'md',
      backdrop: true,
    });
  }

  openAddNewUser(): void {
    this.dropdownOpen = false;
    this.modalService.open(AddNewUserComponent, {
      size: 'md',
      backdrop: true,
    });
  }

  logout(): void {
    this.dropdownOpen = false;
    this.authService.logout();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
