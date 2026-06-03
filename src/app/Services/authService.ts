import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { TEMP_TOKEN } from '../constants/constants';
import { environment } from '../../environments/environments';
import { endpoints } from '../constants/endPoints';

export interface LoginResponse {
  data: {
    id: number;
    name: '';
    role: '';
    token: '';
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'AdminUser/AdminLogin';

  constructor(private http: HttpClient, private storage: StorageService) {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.BaseURL}/${endpoints.admin.login}`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.storage.setItem(TEMP_TOKEN, res.data.token);
          console.log(res.data.token);

          this.storage.setItem('crm_user', JSON.stringify(res.data));
          console.log(res.data);
        })
      );
  }
  forgetPasswort(payload: any) {
    return this.http.post(
      `${environment.BaseURL}/${endpoints.admin.forgetPassword}`,
      { email: payload }
    );
  }
  verifyOTP(payload: any) {
    return this.http.post(
      `${environment.BaseURL}/${endpoints.admin.varifyOTP}`,
      payload
    );
  }
  resetPassword(payload: any) {
    return this.http.post(
      `${environment.BaseURL}/${endpoints.admin.resetPassword}`,
      payload
    );
  }
  changePassword(payload: any) {
    return this.http.post(
      `${environment.BaseURL}/${endpoints.admin.changePassword}`,
      payload
    );
  }
  addNewAdmin(payload: any) {
    return this.http.post(
      `${environment.BaseURL}/${endpoints.admin.addNewAdmin}`,
      payload
    );
  }
  logout() {
    this.storage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.storage.getItem(TEMP_TOKEN);
  }

  getCurrentUser() {
    const user = this.storage.getItem('crm_user');
    if (!user || user === 'undefined' || user === 'null') return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return this.storage.getItem(TEMP_TOKEN);
  }
}
