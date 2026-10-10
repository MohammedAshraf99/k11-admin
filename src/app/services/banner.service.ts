import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner, ApiResponse } from '../core/models/api';
import {  environment} from '../../enviroments/environment'
export interface UploadImageResponse {
  success: boolean;
  message: string;
  imageUrl: string;
}


@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/banners';
  getBanners(): Observable<ApiResponse<Banner[]>> {
    return this.http.get<ApiResponse<Banner[]>>(this.apiUrl);
  }

  createBanner(formData: FormData): Observable<ApiResponse<Banner>> {
    return this.http.post<ApiResponse<Banner>>(this.apiUrl, formData);
  }

  updateBanner(
    id: string,
    formData: FormData,
  ): Observable<ApiResponse<Banner>> {
    return this.http.put<ApiResponse<Banner>>(`${this.apiUrl}/${id}`, formData);
  }

  deleteBanner(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  uploadImage(formData: FormData): Observable<UploadImageResponse> {
    return this.http.post<UploadImageResponse>(
      `${this.apiUrl}/upload-image`,
      formData,
    );
  }
}
