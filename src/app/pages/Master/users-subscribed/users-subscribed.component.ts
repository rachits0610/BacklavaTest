import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MasterService } from '../../../Services/master.service';
import { BreadcrumComponent } from '../../../components/breadcrum/breadcrum.component';
import { ReusableTableComponent } from '../../../components/reusable-table/reusable-table.component';

interface SubscribedUser {
  email: string;
  subscribedAt: string;
}

@Component({
  selector: 'app-users-subscribed',
  standalone: true,
  imports: [CommonModule, DatePipe, BreadcrumComponent, ReusableTableComponent],
  templateUrl: './users-subscribed.component.html',
  styleUrl: './users-subscribed.component.css',
})
export class UsersSubscribedComponent implements OnInit {
  subscribedUsers: SubscribedUser[] = [];
  isLoading = false;

  pageNo = 1;
  pageSize = 10;
  noOfData = 0;
  pageArr: number[] = [];
  isNextPageAvailable = false;

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.loadSubscribedUsers(this.pageNo);
  }

  loadSubscribedUsers(page: number) {
    this.isLoading = true;
    const payload = { pageNo: page, pageSize: this.pageSize };
    this.masterService.getSubscribedUsers(payload).subscribe({
      next: (res: any) => {
        const data = res?.data;
        this.subscribedUsers = data?.users ?? [];
        this.noOfData = data?.totalRecords ?? 0;
        this.pageNo = data?.pageNo ?? page;
        this.pageSize = data?.pageSize ?? this.pageSize;
        this.isNextPageAvailable = data?.nextPageAvailable ?? false;
        this.buildPageArr();
        this.isLoading = false;
      },
      error: () => {
        this.subscribedUsers = [];
        this.noOfData = 0;
        this.pageArr = [];
        this.isNextPageAvailable = false;
        this.isLoading = false;
      },
    });
  }

  buildPageArr() {
    const totalPages = Math.ceil(this.noOfData / this.pageSize) || 1;
    this.pageArr = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.pageArr.length) return;
    this.subscribedUsers = [];
    this.loadSubscribedUsers(page);
  }

  exportToCSV() {
    if (this.subscribedUsers.length === 0) return;

    const headers = ['#', 'Email', 'Subscribed At'];
    const rows = this.subscribedUsers.map((u, i) => [
      i + 1,
      u.email,
      new Date(u.subscribedAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscribed-users-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
