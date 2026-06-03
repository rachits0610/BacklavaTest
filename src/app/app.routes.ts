import { Routes } from '@angular/router';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { SignInGuard } from './guards/sign-in.guard';
import { AuthGuard } from './guards/authGuard';

export const routes: Routes = [
  {
    path: '',
    component: AdminLoginComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'admin',
    canActivate: [SignInGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.adminRoutes),
  },

  { path: '**', redirectTo: '' },
];
