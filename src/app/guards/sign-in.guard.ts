import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { StorageService } from '../Services/storage.service';
import { TEMP_TOKEN } from '../constants/constants';

export const SignInGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const localStorage = inject(StorageService);
  const router = inject(Router);
  if (localStorage.getItem(TEMP_TOKEN)) {
    return true;
  }
  router.navigate(['']);
  return false;
};
