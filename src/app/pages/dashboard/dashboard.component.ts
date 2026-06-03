// import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Chart, registerables } from 'chart.js';
// import { Router, ActivatedRoute } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';

// import { MasterService } from '../../Services/master.service';
// import { AddCategoryComponent } from '../../Modals/add-category/add-category.component';
// import { interval, Subscription } from 'rxjs';
// import { StateService } from '../../Services/state.service';

// Chart.register(...registerables);

// const REGION_COLORS = ['#442a20', '#185fa5', '#0d9488', '#7c3aed', '#d97706'];
// const PAYMENT_COLORS = [
//   '#442a20',
//   '#185fa5',
//   '#0d9488',
//   '#7c3aed',
//   '#d97706',
//   '#dc2626',
// ];
// const ORDER_STATUS_COLORS: Record<string, string> = {
//   Delivered: '#16a34a',
//   Confirmed: '#16a34a',
//   Processing: '#2563eb',
//   Pending: '#d97706',
//   Cancelled: '#dc2626',
// };

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css',
// })
// export class DashboardComponent implements OnInit, AfterViewInit {
//   currentDateTime = '';
//   avatarColors = ['#442a20', '#185fa5', '#0d9488', '#7c3aed', '#d97706'];

//   dataSummary = {
//     totalProducts: 0,
//     pendingOrders: 0,
//     deliveredOrders: 0,
//     totalUsers: 0,
//     totalCategories: 0,
//     totalRevenue: 0,
//   };

//   topCustomers: any[] = [];
//   regions: any[] = [];
//   orderStatusDistribution: any[] = [];
//   paymentMethodsDistribution: any[] = [];
//   deliveredProductsByCategory: any[] = [];

//   totalRegionOrders = 0;
//   bestRegion = '—';
//   paymentSummary = { totalTransactions: 0, totalAmount: 0 };

//   private salesPerformance: any[] = [];
//   private monthlyRevenueTrend: any[] = [];
//   private charts: Chart[] = [];
//   private viewReady = false;
//   private dataReady = false;

//   constructor(
//     private masterService: MasterService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private modalService: NgbModal,
//     private toastr: ToastrService,
//     private stateService: StateService
//   ) {}
//   private clockSubscription!: Subscription;
//   private setDateTime(): void {
//     const now = new Date();
//     this.currentDateTime =
//       now.toLocaleDateString('en-IN', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       }) +
//       ' — ' +
//       now.toLocaleTimeString('en-IN', {
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//       });
//   }

//   ngOnInit(): void {
//     setTimeout(() => {
//       this.stateService.setSidebarOpen(false);
//     });

//     this.setDateTime();
//     this.clockSubscription = interval(1000).subscribe(() => {
//       this.setDateTime();
//     });

//     this.loadDashBoard();
//   }

//   ngAfterViewInit(): void {
//     this.viewReady = true;
//     if (this.dataReady) this.buildCharts();
//   }

//   addProduct(): void {
//     this.router.navigate(['/admin/products/add-product']);
//   }

//   addCategory(): void {
//     const modalRef = this.modalService.open(AddCategoryComponent, {
//       centered: false,
//       backdrop: 'static',
//       size: 'md',
//     });

//     modalRef.componentInstance.mode = 'add';
//     modalRef.componentInstance.modalHeading = 'Add Category';
//     modalRef.componentInstance.ModalData = {
//       categoryId: 0,
//       categoryName: '',
//       statusId: 0,
//       statusName: '',
//     };

//     modalRef.result
//       .then((result) => {
//         if (result === 1) {
//           this.toastr.success('Category added successfully', 'Success');
//           this.loadDashBoard();
//         }
//       })
//       .catch(() => {});
//   }

//   loadDashBoard(): void {
//     const payload = { year: 0, categoryId: 0 };

//     this.masterService.getDasdBoardData(payload).subscribe({
//       next: (res: any) => {
//         const d = res.data;

//         this.dataSummary = d.summary;

//         this.topCustomers = d.topCustomers ?? [];

//         this.deliveredProductsByCategory = d.deliveredProductsByCategory ?? [];

//         const maxRevenue = Math.max(
//           ...(d.revenueByRegionData ?? []).map((r: any) => r.revenue),
//           1
//         );
//         this.regions = (d.revenueByRegionData ?? []).map(
//           (r: any, i: number) => ({
//             ...r,
//             pct: Math.round((r.revenue / maxRevenue) * 100),
//             color: REGION_COLORS[i % REGION_COLORS.length],
//           })
//         );
//         this.totalRegionOrders = this.regions.reduce(
//           (s: number, r: any) => s + r.totalOrders,
//           0
//         );
//         this.bestRegion = this.regions.length
//           ? this.regions.reduce((a: any, b: any) =>
//               a.revenue >= b.revenue ? a : b
//             ).region
//           : '—';

//         this.orderStatusDistribution = (d.orderStatusDistribution ?? []).map(
//           (s: any) => ({
//             ...s,
//             color: ORDER_STATUS_COLORS[s.statusName] ?? '#888',
//           })
//         );

//         this.salesPerformance = d.salesPerformance ?? [];
//         this.monthlyRevenueTrend = d.monthlyRevenueTrend ?? [];

//         this.paymentSummary = d.paymentMethodsSummary ?? {
//           totalTransactions: 0,
//           totalAmount: 0,
//         };
//         this.paymentMethodsDistribution = (
//           d.paymentMethodsDistribution ?? []
//         ).map((p: any, i: number) => ({
//           ...p,
//           color: PAYMENT_COLORS[i % PAYMENT_COLORS.length],
//         }));

//         this.dataReady = true;
//         if (this.viewReady) this.buildCharts();
//       },
//       error: (err) => console.error('Dashboard load error:', err),
//     });
//   }

//   private destroyCharts(): void {
//     this.charts.forEach((c) => c.destroy());
//     this.charts = [];
//   }

//   private buildCharts(): void {
//     this.destroyCharts();

//     const months = [
//       'Jan',
//       'Feb',
//       'Mar',
//       'Apr',
//       'May',
//       'Jun',
//       'Jul',
//       'Aug',
//       'Sep',
//       'Oct',
//       'Nov',
//       'Dec',
//     ];

//     if (this.deliveredProductsByCategory.length > 0) {
//       this.charts.push(
//         new Chart('catChart', {
//           type: 'bar',
//           data: {
//             labels: this.deliveredProductsByCategory.map(
//               (c: any) => c.categoryName
//             ),
//             datasets: [
//               {
//                 label: 'Sales',
//                 data: this.deliveredProductsByCategory.map(
//                   (c: any) => c.totalSales ?? c.value ?? 0
//                 ),
//                 backgroundColor: '#442a20',
//                 borderRadius: 4,
//               },
//             ],
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: { legend: { display: false } },
//             scales: {
//               x: { grid: { display: false } },
//               y: { grid: { color: '#f0ece6' }, beginAtZero: true },
//             },
//           },
//         })
//       );
//     }

//     const salesLabels = this.salesPerformance.map((m: any) => m.month);
//     const salesData = this.salesPerformance.map((m: any) => m.value);
//     this.charts.push(
//       new Chart('salesChart', {
//         type: 'line',
//         data: {
//           labels: salesLabels.length ? salesLabels : months,
//           datasets: [
//             {
//               label: 'Sales',
//               data: salesData.length ? salesData : Array(12).fill(0),
//               borderColor: '#dc2626',
//               pointBackgroundColor: '#dc2626',
//               pointRadius: 4,
//               tension: 0,
//               fill: false,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: { legend: { display: false } },
//           scales: {
//             x: {
//               grid: { display: false },
//               ticks: { autoSkip: false, maxRotation: 0 },
//             },
//             y: { grid: { color: '#f0ece6' }, beginAtZero: true },
//           },
//         },
//       })
//     );

//     if (this.orderStatusDistribution.length > 0) {
//       this.charts.push(
//         new Chart('orderPie', {
//           type: 'pie',
//           data: {
//             labels: this.orderStatusDistribution.map((s: any) => s.statusName),
//             datasets: [
//               {
//                 data: this.orderStatusDistribution.map(
//                   (s: any) => s.percentage
//                 ),
//                 backgroundColor: this.orderStatusDistribution.map(
//                   (s: any) => s.color
//                 ),
//                 borderWidth: 2,
//                 borderColor: '#fff',
//               },
//             ],
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: { legend: { display: false } },
//           },
//         })
//       );
//     }

//     const revLabels = this.monthlyRevenueTrend.map((m: any) => m.month);
//     const revData = this.monthlyRevenueTrend.map((m: any) => m.revenue);
//     this.charts.push(
//       new Chart('revenueChart', {
//         type: 'line',
//         data: {
//           labels: revLabels.length ? revLabels : months,
//           datasets: [
//             {
//               label: 'Revenue',
//               data: revData.length ? revData : Array(12).fill(0),
//               borderColor: '#d97706',
//               backgroundColor: 'rgba(217,119,6,0.12)',
//               fill: true,
//               tension: 0.4,
//               pointRadius: 0,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: { legend: { display: false } },
//           scales: {
//             x: {
//               grid: { display: false },
//               ticks: { autoSkip: false, maxRotation: 0 },
//             },
//             y: { grid: { color: '#f0ece6' }, beginAtZero: true },
//           },
//         },
//       })
//     );

//     if (this.paymentMethodsDistribution.length > 0) {
//       this.charts.push(
//         new Chart('payPie', {
//           type: 'doughnut',
//           data: {
//             labels: this.paymentMethodsDistribution.map(
//               (p: any) => p.paymentMethod
//             ),
//             datasets: [
//               {
//                 data: this.paymentMethodsDistribution.map(
//                   (p: any) => p.percentageOfTotal
//                 ),
//                 backgroundColor: this.paymentMethodsDistribution.map(
//                   (p: any) => p.color
//                 ),
//                 borderWidth: 2,
//                 borderColor: '#fff',
//               },
//             ],
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: { legend: { display: false } },
//             cutout: '55%',
//           } as any,
//         })
//       );
//     }
//   }
//   ngOnDestroy(): void {
//     this.clockSubscription?.unsubscribe();
//   }
// }

import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';

import { MasterService } from '../../Services/master.service';
import { AddCategoryComponent } from '../../Modals/add-category/add-category.component';
import { StateService } from '../../Services/state.service';

Chart.register(...registerables);

const REGION_COLORS = ['#442a20', '#185fa5', '#0d9488', '#7c3aed', '#d97706'];
const PAYMENT_COLORS = [
  '#442a20',
  '#185fa5',
  '#0d9488',
  '#7c3aed',
  '#d97706',
  '#dc2626',
];
const ORDER_STATUS_COLORS: Record<string, string> = {
  Delivered: '#16a34a',
  Confirmed: '#16a34a',
  Processing: '#2563eb',
  Pending: '#d97706',
  Cancelled: '#dc2626',
  Failed: '#dc2626',
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  currentDateTime = '';
  private clockSub!: Subscription;

  avatarColors = ['#442a20', '#185fa5', '#0d9488', '#7c3aed', '#d97706'];

  dataSummary = {
    totalProducts: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalRevenue: 0,
  };

  topCustomers: any[] = [];
  regions: any[] = [];
  orderStatusDistribution: any[] = [];
  paymentMethodsDistribution: any[] = [];
  deliveredProductsByCategory: any[] = [];

  totalRegionOrders = 0;
  bestRegion = '—';

  paymentSummary = { totalTransactions: 0, totalAmount: 0 };

  availableYears: number[] = [];
  categories: any[] = [];

  selectedSalesYear = new Date().getFullYear();
  selectedSalesCategory = 0;
  selectedRevenueYear = new Date().getFullYear();

  private allSalesPerformance: any[] = [];
  private allMonthlyRevenueTrend: any[] = [];

  private charts: Map<string, Chart> = new Map();

  private viewReady = false;
  private dataReady = false;

  constructor(
    private masterService: MasterService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private stateService: StateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.stateService.setSidebarOpen(false));
    this.setDateTime();
    this.clockSub = interval(1000).subscribe(() => this.setDateTime());
    this.buildYearList();
    this.loadDashBoard();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.dataReady) {
      this.cdr.detectChanges();
      setTimeout(() => this.buildAllCharts(), 0);
    }
  }

  ngOnDestroy(): void {
    this.clockSub?.unsubscribe();
    this.destroyAllCharts();
  }

  private setDateTime(): void {
    const now = new Date();
    this.currentDateTime =
      now.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) +
      ' — ' +
      now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
  }

  private buildYearList(): void {
    const current = new Date().getFullYear();
    this.availableYears = [current - 2, current - 1, current, current + 1];
  }

  addProduct(): void {
    this.router.navigate(['/admin/products/add-product']);
  }

  addCategory(): void {
    const ref = this.modalService.open(AddCategoryComponent, {
      centered: false,
      backdrop: 'static',
      size: 'md',
    });
    ref.componentInstance.mode = 'add';
    ref.componentInstance.modalHeading = 'Add Category';
    ref.componentInstance.ModalData = {
      categoryId: 0,
      categoryName: '',
      statusId: 0,
      statusName: '',
    };
    ref.result
      .then((r) => {
        if (r === 1) {
          this.toastr.success('Category added successfully', 'Success');
          this.loadDashBoard();
        }
      })
      .catch(() => {});
  }

  loadDashBoard(): void {
    const payload = {
      year: this.selectedRevenueYear,
      categoryId: this.selectedSalesCategory,
    };

    this.masterService.getDasdBoardData(payload).subscribe({
      next: (res: any) => {
        const d = res.data;

        this.dataSummary = d.summary;

        this.topCustomers = d.topCustomers ?? [];

        this.deliveredProductsByCategory = d.deliveredProductsByCategory ?? [];

        this.categories = this.deliveredProductsByCategory.map((c: any) => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName,
        }));

        this.regions = (d.revenueByRegionData ?? []).map(
          (r: any, i: number) => ({
            ...r,
            pct: Math.round(r.percentage ?? 0),
            color: REGION_COLORS[i % REGION_COLORS.length],
          })
        );
        this.totalRegionOrders = this.regions.reduce(
          (s: number, r: any) => s + r.totalOrders,
          0
        );
        this.bestRegion = this.regions.length
          ? this.regions.reduce((a: any, b: any) =>
              a.revenue >= b.revenue ? a : b
            ).region
          : '—';

        this.orderStatusDistribution = (d.orderStatusDistribution ?? []).map(
          (s: any) => ({
            ...s,
            color: ORDER_STATUS_COLORS[s.statusName] ?? '#6b7280',
          })
        );

        this.allSalesPerformance = d.salesPerformance ?? [];

        this.allMonthlyRevenueTrend = d.monthlyRevenueTrend ?? [];

        this.paymentSummary = d.paymentMethodsSummary ?? {
          totalTransactions: 0,
          totalAmount: 0,
        };
        this.paymentMethodsDistribution = (
          d.paymentMethodsDistribution ?? []
        ).map((p: any, i: number) => ({
          ...p,
          color: PAYMENT_COLORS[i % PAYMENT_COLORS.length],
        }));

        this.dataReady = true;
        if (this.viewReady) {
          this.cdr.detectChanges();
          setTimeout(() => this.buildAllCharts(), 0);
        }
      },
      error: (err) => console.error('Dashboard load error:', err),
    });
  }

  onSalesYearChange(): void {
    this.loadDashBoard();
  }

  onSalesCategoryChange(): void {
    this.loadDashBoard();
  }

  onRevenueYearChange(): void {
    this.loadDashBoard();
  }

  private destroyChart(id: string): void {
    const c = this.charts.get(id);
    if (c) {
      c.destroy();
      this.charts.delete(id);
    }
  }

  private destroyAllCharts(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts.clear();
  }

  private buildAllCharts(): void {
    this.destroyAllCharts();
    this.buildCategoryChart();
    this.buildSalesChart(this.allSalesPerformance);
    this.buildOrderPieChart();
    this.buildRevenueChart(this.allMonthlyRevenueTrend);
    this.buildPaymentChart();
  }

  private buildCategoryChart(): void {
    if (!this.deliveredProductsByCategory.length) return;
    const canvas = document.getElementById(
      'catChart'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    this.charts.set(
      'catChart',
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: this.deliveredProductsByCategory.map(
            (c: any) => c.categoryName
          ),
          datasets: [
            {
              label: 'Delivered Products',
              data: this.deliveredProductsByCategory.map(
                (c: any) => c.deliveredProducts ?? 0
              ),
              backgroundColor: '#442a20',
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.y} delivered products`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              title: {
                display: true,
                text: 'Category',
                font: { size: 11 },
                color: '#888',
              },
            },
            y: {
              grid: { color: '#f0ece6' },
              beginAtZero: true,
              ticks: { stepSize: 1, precision: 0 },
              title: {
                display: true,
                text: 'Delivered Products',
                font: { size: 11 },
                color: '#888',
              },
            },
          },
        },
      })
    );
  }

  private buildSalesChart(data: any[]): void {
    this.destroyChart('salesChart');
    const canvas = document.getElementById(
      'salesChart'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    this.charts.set(
      'salesChart',
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: data.map((m: any) => m.month),
          datasets: [
            {
              label: 'Orders',
              data: data.map((m: any) => m.value ?? 0),
              borderColor: '#dc2626',
              pointBackgroundColor: '#dc2626',
              pointRadius: 4,
              tension: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.y} orders`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { autoSkip: false, maxRotation: 0 },
              title: {
                display: true,
                text: 'Month',
                font: { size: 11 },
                color: '#888',
              },
            },
            y: {
              grid: { color: '#f0ece6' },
              beginAtZero: true,
              ticks: { stepSize: 1, precision: 0 },
              title: {
                display: true,
                text: 'Number of Orders',
                font: { size: 11 },
                color: '#888',
              },
            },
          },
        },
      })
    );
  }

  private buildOrderPieChart(): void {
    if (!this.orderStatusDistribution.length) return;
    const canvas = document.getElementById(
      'orderPie'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    this.charts.set(
      'orderPie',
      new Chart(canvas, {
        type: 'pie',
        data: {
          labels: this.orderStatusDistribution.map((s: any) => s.statusName),
          datasets: [
            {
              data: this.orderStatusDistribution.map((s: any) => s.percentage),
              backgroundColor: this.orderStatusDistribution.map(
                (s: any) => s.color
              ),
              borderWidth: 2,
              borderColor: '#fff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const s = this.orderStatusDistribution[ctx.dataIndex];
                  return ` ${s.statusName}: ${
                    s.count
                  } orders (${s.percentage.toFixed(1)}%)`;
                },
              },
            },
          },
        },
      })
    );
  }

  private buildRevenueChart(data: any[]): void {
    this.destroyChart('revenueChart');
    const canvas = document.getElementById(
      'revenueChart'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    this.charts.set(
      'revenueChart',
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: data.map((m: any) => m.month),
          datasets: [
            {
              label: 'Revenue (₹)',
              data: data.map((m: any) => m.revenue ?? 0),
              borderColor: '#d97706',
              backgroundColor: 'rgba(217,119,6,0.12)',
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#d97706',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  ` ₹${(ctx.parsed.y as number).toLocaleString('en-IN')}`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { autoSkip: false, maxRotation: 0 },
              title: {
                display: true,
                text: 'Month',
                font: { size: 11 },
                color: '#888',
              },
            },
            y: {
              grid: { color: '#f0ece6' },
              beginAtZero: true,
              title: {
                display: true,
                text: 'Revenue (₹)',
                font: { size: 11 },
                color: '#888',
              },
              ticks: {
                callback: (v) => '₹' + Number(v).toLocaleString('en-IN'),
              },
            },
          },
        },
      })
    );
  }

  private buildPaymentChart(): void {
    if (!this.paymentMethodsDistribution.length) return;
    const canvas = document.getElementById(
      'payPie'
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    this.charts.set(
      'payPie',
      new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: this.paymentMethodsDistribution.map(
            (p: any) => p.paymentMethod
          ),
          datasets: [
            {
              data: this.paymentMethodsDistribution.map(
                (p: any) => p.percentageOfTotal
              ),
              backgroundColor: this.paymentMethodsDistribution.map(
                (p: any) => p.color
              ),
              borderWidth: 2,
              borderColor: '#fff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx: any) => {
                  const p = this.paymentMethodsDistribution[ctx.dataIndex];
                  return ` ${p.paymentMethod}: ₹${p.amount.toLocaleString(
                    'en-IN'
                  )} (${p.percentageOfTotal.toFixed(1)}%)`;
                },
              },
            },
          },
          cutout: '55%',
        } as any,
      })
    );
  }
}
