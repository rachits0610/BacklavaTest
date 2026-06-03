import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../pages/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../pages/products/products.routes').then(
            (m) => m.productRoutes
          ),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('../pages/customers/customers.routes').then(
            (m) => m.customersRoutes
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../pages/orders/orders.routes').then((m) => m.orderRoutes),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('../pages/payments/payments.routes').then(
            (m) => m.paymentRouts
          ),
      },
      {
        path: 'master',
        loadChildren: () =>
          import('../pages/Master/master.routes').then((m) => m.masterRoutes),
      },
    ],
  },
];
