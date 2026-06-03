import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { endpoints } from '../constants/endPoints';

@Injectable({ providedIn: 'root' })
export class MainService {
  constructor(private httpClient: HttpClient) {}

  getAllProducts(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.allProductsList}`,
      payload
    );
  }

  addProduct(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.addUpdateProduct}`,
      payload
    );
  }
  getCategoriesDDl() {
    return this.httpClient.get(
      `${environment.BaseURL}/${endpoints.categoryDDl}`
    );
  }
  getSubCategoryDDl(id: any) {
    return this.httpClient.get(
      `${environment.BaseURL}/${endpoints.subCategoryDDl}/${id}`
    );
  }
  deleteProductById(id: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.deleteProductById}/${id}`,
      { id }
    );
  }
  getAllCustomers(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.allUsersList}`,
      payload
    );
  }
  getAllOrders(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.allOrders}`,
      payload
    );
  }
  getAllPayments(payload: any) {
    return this.httpClient.post(
      `${environment.BaseURL}/${endpoints.getAllPayments}`,
      payload
    );
  }
  getOrderStatusDDl() {
    return this.httpClient.get(
      `${environment.BaseURL}/${endpoints.getOrderStatusDDl}`
    );
  }
  getPaymentStatusDDL() {
    return this.httpClient.get(
      `${environment.BaseURL}/${endpoints.paymentStatusDdl}`
    );
  }
}
