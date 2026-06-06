// Route that was before /Admin in BaseUrl

// import { Routes } from '@angular/router';
// import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
// import { SignInGuard } from './guards/sign-in.guard';
// import { AuthGuard } from './guards/authGuard';

// export const routes: Routes = [
//   {
//     path: '',
//     component: AdminLoginComponent,
//     canActivate: [AuthGuard],
//   },

//   {
//     path: 'admin',
//     canActivate: [SignInGuard],
//     loadChildren: () =>
//       import('./admin/admin.routes').then((m) => m.adminRoutes),
//   },

//   { path: '**', redirectTo: '/admin' },
// ];

import { Routes } from '@angular/router';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { SignInGuard } from './guards/sign-in.guard';
import { AuthGuard } from './guards/authGuard';

export const routes: Routes = [
  {
    path: '',
    component: AdminLoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [SignInGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'DashBoard-The Baklava Studio Admin',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes
          ),
      },
      {
        path: 'products',
        title: 'Products-The Baklava Studio Admin',
        loadChildren: () =>
          import('./pages/products/products.routes').then(
            (m) => m.productRoutes
          ),
      },
      {
        path: 'customers',
        title: 'Customer-The Baklava Studio Admin',
        loadChildren: () =>
          import('./pages/customers/customers.routes').then(
            (m) => m.customersRoutes
          ),
      },
      {
        path: 'orders',
        title: 'Orders-The Baklava Studio Admin',
        loadChildren: () =>
          import('./pages/orders/orders.routes').then((m) => m.orderRoutes),
      },
      {
        path: 'payments',
        title: 'Payments-The Baklava Studio Admin',
        loadChildren: () =>
          import('./pages/payments/payments.routes').then(
            (m) => m.paymentRouts
          ),
      },
      {
        path: 'master',
        loadChildren: () =>
          import('./pages/Master/master.routes').then((m) => m.masterRoutes),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
