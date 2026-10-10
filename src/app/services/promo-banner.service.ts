import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner, ApiResponse, PromoBanner } from '../core/models/api';
import { environment } from '../../enviroments/environment';

export interface UploadImageResponse {
  success: boolean;
  message: string;
  imageUrl: string;
}


@Injectable({
  providedIn: 'root',
})
export class PromoBannerService {
private http = inject(HttpClient);
  private apiUrl = environment.apiUrl+'/promo-banners'; // استبدل بالرابط الخاص بك

  getBanners(): Observable<ApiResponse<PromoBanner[]>> {
    return this.http.get<ApiResponse<PromoBanner[]>>(this.apiUrl);
  }

  createBanner(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateBanner(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteBanner(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
