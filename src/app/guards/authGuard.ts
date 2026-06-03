import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../Services/storage.service';
import { TEMP_TOKEN } from '../constants/constants';

export const AuthGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (storage.getItem(TEMP_TOKEN)) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  return true;
};
