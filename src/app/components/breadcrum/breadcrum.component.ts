import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrum',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrum.component.html',
  styleUrl: './breadcrum.component.css',
})
export class BreadcrumComponent implements OnInit {
  @Input() header: string = '';
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.build();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.build());
  }

  build(): void {
    const allSegments = this.router.url.split('/').filter(Boolean);

    const adminIndex = allSegments.indexOf('admin');
    const displaySegments =
      adminIndex !== -1 ? allSegments.slice(adminIndex + 1) : allSegments;

    const basePath =
      adminIndex !== -1
        ? '/' + allSegments.slice(0, adminIndex + 1).join('/')
        : '';

    this.breadcrumbs = [];
    let path = basePath;

    for (const seg of displaySegments) {
      path += `/${seg}`;
      this.breadcrumbs.push({ label: this.format(seg), url: path });
    }
  }

  format(seg: string): string {
    return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
