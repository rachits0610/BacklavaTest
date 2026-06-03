import { Routes } from '@angular/router';
import { CategoryComponent } from './category.component';

export const categoryRoutes: Routes = [
  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full',
  },
  {
    path: 'category',
    component: CategoryComponent,
  },
];
