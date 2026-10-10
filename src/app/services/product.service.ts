import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  IProduct,
} from '../core/models/api';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/products';

  /**
   * جلب جميع المنتجات حسب النوع (perfumes | balloons | gifts)
   */
  categoryProducts(type: string): Observable<ApiResponse<IProduct[]>> {
    return this.http.get<ApiResponse<IProduct[]>>(`${this.apiUrl}/category/${type}`);
  }
  Products<IProduct>(): Observable<ApiResponse<IProduct[]>> {
    return this.http.get<ApiResponse<IProduct[]>>(`${this.apiUrl}`);
  }

  /**
   * جلب منتج واحد بالتفصيل عن طريق الـ ID
   */
  getProductById(id: string): Observable<ApiResponse<IProduct>> {
    return this.http.get<ApiResponse<IProduct>>(`${this.apiUrl}/${id}`);
  }

  /**
   * إضافة منتج جديد (Admin)
   */
  createProduct<T>(productData: Partial<T>): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}`, productData);
  }

  /**
   * تعديل بيانات منتج (Admin)
   */
  updateProduct<T>(
    id: string,
    productData: Partial<T>,
  ): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${id}`, productData);
  }

  saleProduct<T>(): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/sale`);
  }

  dealsProduct<T>(): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/deals`);
  }

  productCount(): Observable<ApiResponse<{ category: string; count: number }[]>> {
    return this.http.get<ApiResponse<{ category: string; count: number }[]>>(`${this.apiUrl}/count`);
  }

  /**
   * حذف منتج (Admin)
   */
  deleteProduct(
    id: string | number,
  ): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  uploadImage(formData: FormData): Observable<{ imageUrl: string }> {
    return this.http.post<any>(`${this.apiUrl}/upload-image`, formData);
  }
}
