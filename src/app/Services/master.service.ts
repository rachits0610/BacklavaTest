import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { endpoints } from '../constants/endPoints';

@Injectable({ providedIn: 'root' })
export class MasterService {
  constructor(private httpClient: HttpClient) {}

  addUpdateCategory(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.admin.category.createUpdateCategory}`,
      payload
    );
  }

  getAllCategories(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.admin.category.getAllCategories}`,
      payload
    );
  }
  deleteCategory(id: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.admin.category.deleteCategory}/${id}`,
      { id }
    );
  }
  getAllSubCategories(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.getAllSubCategories}`,
      payload
    );
  }

  getCategoriesDDl() {
    return this.httpClient.get(
      `${environment.BaseURL}/${endpoints.categoryDDl}`
    );
  }
  addSubCategory(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.createUpdateSubCategory}`,
      payload
    );
  }
  deleteSubcategory(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.deleteSubCategory}/${payload}`,
      payload
    );
  }

  addCustomer(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.createUser}`,
      payload
    );
  }

  updateCustomer(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.updateUserByUserId}/${payload.customerId}`,
      payload
    );
  }
  deleteCustomer(customerId: number) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.deleteCustomer}/${customerId}`,
      {}
    );
  }
  getDasdBoardData(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.getDashboardData}`,
      payload
    );
  }
  getSubscribedUsers(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.getSubscribedUsers}`,
      payload
    );
  }
  getContactedUsers(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.getContactedUsers}`,
      payload
    );
  }
}
