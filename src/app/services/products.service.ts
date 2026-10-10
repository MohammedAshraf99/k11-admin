import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ProductQueryParams,
  ApiResponse,
  Product,
  IProduct,
} from '../core/models/api';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/products'; // Adjust base API URL
  /** Fetch products with active filters and pagination */
  getProducts(type: string): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/category/${type}`);
  }
   allProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}`);
  }

  /** Get single product by ID */
  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  /** Create new product (Admin) */
  createProduct(
    productData: Partial<IProduct>,
  ): Observable<ApiResponse<Product>> {
    console.log(productData);
    return this.http.post<ApiResponse<Product>>(this.apiUrl, productData);
  }
  uploadImage(formData: FormData): Observable<{ imageUrl: string }> {
    return this.http.post<any>(`${this.apiUrl}/upload-image`, formData);
  }

  /** Update existing product (Admin) */
  updateProduct(
    id: string,
    productData: Partial<Product>,
  ): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(
      `${this.apiUrl}/${id}`,
      productData,
    );
  }

  /** Delete product (Admin) */
  deleteProduct(
    id: string,
  ): Observable<ApiResponse<{ deletedProductId: string }>> {
    return this.http.delete<ApiResponse<{ deletedProductId: string }>>(
      `${this.apiUrl}/${id}`,
    );
  }
}
