import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../Services/master.service';
import { BreadcrumComponent } from '../../../components/breadcrum/breadcrum.component';
import { ReusableTableComponent } from '../../../components/reusable-table/reusable-table.component';
import { ContactedUser } from '../../../models/model';

@Component({
  selector: 'app-users-contacted',
  standalone: true,
  imports: [CommonModule,  BreadcrumComponent, ReusableTableComponent],
  templateUrl: './users-contacted.component.html',
  styleUrl: './users-contacted.component.css',
})
export class UsersContactedComponent implements OnInit {
  contactedUsers: ContactedUser[] = [];
  isLoading = false;

  pageNo = 1;
  pageSize = 10;
  noOfData = 0;
  pageArr: number[] = [];
  isNextPageAvailable = false;

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.loadContactedUsers(this.pageNo);
  }

  loadContactedUsers(page: number) {
    this.isLoading = true;
    const payload = { pageNo: page, pageSize: this.pageSize };
    this.masterService.getContactedUsers(payload).subscribe({
      next: (res: any) => {
        const data = res?.data;
        this.contactedUsers = data?.users ?? [];
        this.noOfData = data?.totalRecords ?? 0;
        this.pageNo = data?.pageNo ?? page;
        this.pageSize = data?.pageSize ?? this.pageSize;
        this.isNextPageAvailable = data?.nextPageAvailable ?? false;
        this.buildPageArr();
        this.isLoading = false;
      },
      error: () => {
        this.contactedUsers = [];
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
    this.contactedUsers = [];
    this.loadContactedUsers(page);
  }

  exportToCSV() {
    if (!this.contactedUsers.length) return;

    const headers = [
      'S.No',
      'Name',
      'Email',
      'Phone',
      'Subject',
      'Message',
      'Contacted At',
    ];
    const rows = this.contactedUsers.map((u, i) => [
      i + 1,
      u.name,
      u.email,
      u.phoneNumber,
      u.subjectName,
      u.message,
      new Date(u.contactedUsAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacted-users-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
