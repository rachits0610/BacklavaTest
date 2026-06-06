import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const adminRoutes: Routes = [
  //repetetive /Admin removed due to which router moved to routes.ts file
  // {
  //   path: '',
  //   component: AdminLayoutComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'dashboard',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'dashboard',
  //       title: 'DashBoard-The Baklava Studio Admin',
  //       loadChildren: () =>
  //         import('../pages/dashboard/dashboard.routes').then(
  //           (m) => m.dashboardRoutes
  //         ),
  //     },
  //     {
  //       path: 'products',
  //       title: 'Products-The Baklava Studio Admin',
  //       loadChildren: () =>
  //         import('../pages/products/products.routes').then(
  //           (m) => m.productRoutes
  //         ),
  //     },
  //     {
  //       path: 'customers',
  //       title: 'Customer-The Baklava Studio Admin',
  //       loadChildren: () =>
  //         import('../pages/customers/customers.routes').then(
  //           (m) => m.customersRoutes
  //         ),
  //     },
  //     {
  //       path: 'orders',
  //       title: 'Orders-The Baklava Studio Admin',
  //       loadChildren: () =>
  //         import('../pages/orders/orders.routes').then((m) => m.orderRoutes),
  //     },
  //     {
  //       path: 'payments',
  //       title: 'Payments-The Baklava Studio Admin',
  //       loadChildren: () =>
  //         import('../pages/payments/payments.routes').then(
  //           (m) => m.paymentRouts
  //         ),
  //     },
  //     {
  //       path: 'master',
  //       loadChildren: () =>
  //         import('../pages/Master/master.routes').then((m) => m.masterRoutes),
  //     },
  //   ],
  // },
];
