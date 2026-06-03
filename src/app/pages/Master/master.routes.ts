import { Routes } from '@angular/router';

export const masterRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../Master/category/category.routes').then(
        (m) => m.categoryRoutes
      ),
  },
  {
    path: 'sub-category',
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
];
