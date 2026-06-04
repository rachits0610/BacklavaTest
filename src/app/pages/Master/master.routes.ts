import { Routes } from '@angular/router';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { CategoryComponent } from './category/category.component';
import { UsersSubscribedComponent } from './users-subscribed/users-subscribed.component';
import { UsersContactedComponent } from './users-contacted/users-contacted.component';

export const masterRoutes: Routes = [
  {
    path: '',
    title: 'Category-The Baklava Studio Admin',
    loadChildren: () =>
      import('../Master/category/category.routes').then(
        (m) => m.categoryRoutes
      ),
  },
  {
    path: 'sub-category',
    title: 'Sub Category-The Baklava Studio Admin',
    loadChildren: () =>
      import('../Master/sub-category/subCategory.routes').then(
        (m) => m.subcategoryRoutes
      ),
  },
  {
    path: 'unit-price',
    loadChildren: () =>
      import('../Master/unit-price/unitPrice.routes').then(
        (m) => m.unitPriceRoutes
      ),
  },
  {
    path: 'subscribed',
    title: 'Subscribed Users-The Baklava Studio Admin',
    component: UsersSubscribedComponent,
  },
  {
    path: 'contacted',
    title: 'Contacted Users-The Baklava Studio Admin',
    component: UsersContactedComponent,
  },
];
