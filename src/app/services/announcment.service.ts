import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../core/models/api';

@Injectable({
  providedIn: 'root'
})
export class AnnouncmentService {

private http = inject(HttpClient);
  private apiUrl =  `${environment.apiUrl}/announcements`;

  // جلب الإعلانات النشطة للبانر
  getActiveAnnouncements(): Observable<{ status: string; data: Announcement[] }> {
    return this.http.get<{ status: string; data: Announcement[] }>(`${this.apiUrl}/active`);
  }

  // جلب الكل للوحة التحكم
  getAllAnnouncements(): Observable<{ status: string; data: Announcement[] }> {
    return this.http.get<{ status: string; data: Announcement[] }>(this.apiUrl);
  }

  // إضافة
  createAnnouncement(data: Announcement): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // تعديل
  updateAnnouncement(id: string, data: Partial<Announcement>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // حذف
  deleteAnnouncement(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


