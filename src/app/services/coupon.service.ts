import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import {
  PromoSettings,
  Coupon,
  ValidateCouponResponse,
} from '../core/models/api';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/coupons';
  private readonly STORAGE_KEY = 'hasSeenPromoModal';

  // Signals
  activePromo = signal<Coupon | null>(null);
  appliedCoupon = signal<ValidateCouponResponse['data'] | null>(null);
  isLoading = signal<boolean>(false);

  /**
   * Validate coupon during checkout against cart total
   */
  validateCoupon(
    code: string,
    cartAmount: number,
  ): Observable<ValidateCouponResponse> {
    this.isLoading.set(true);
    return this.http
      .post<ValidateCouponResponse>(`${this.API_URL}/validate`, {
        code,
        cartAmount,
      })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.appliedCoupon.set(res.data);
          }
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.isLoading.set(false);
          return of({
            success: false,
            message: error.error?.message || 'Failed to validate coupon.',
          });
        }),
      );
  }

  /**
   * Get active promo modal coupon
   */
  getActivePromo(): Observable<any> {
    this.isLoading.set(true);
    return this.http.get<Coupon>(`${this.API_URL}`).pipe(
      tap((config) => {
        this.activePromo.set(config);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        console.error('Failed to load active promo:', error);
        this.isLoading.set(false);
        return of(null);
      }),
    );
 
  }

  // ================= CRUD OPERATIONS =================

  createCoupon(
    couponData: Partial<Coupon>,
  ): Observable<{ success: boolean; data: Coupon }> {
    return this.http.post<{ success: boolean; data: Coupon }>(
      this.API_URL,
      couponData,
    );
  }

  getAllCoupons(): Observable<{
    success: boolean;
    count: number;
    data: Coupon[];
  }> {
    return this.http.get<{ success: boolean; count: number; data: Coupon[] }>(
      this.API_URL,
    );
  }

  getCouponById(id: string): Observable<{ success: boolean; data: Coupon }> {
    return this.http.get<{ success: boolean; data: Coupon }>(
      `${this.API_URL}/${id}`,
    );
  }

  updateCoupon(
    id: string,
    updates: Partial<Coupon>,
  ): Observable<{ success: boolean; data: Coupon }> {
    return this.http.put<{ success: boolean; data: Coupon }>(
      `${this.API_URL}/${id}`,
      updates,
    );
  }

  deleteCoupon(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.API_URL}/${id}`,
    );
  }

  // ================= MODAL VISIBILITY HELPERS =================

  hasUserSeenModal(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  markModalAsSeen(): void {
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }

  resetModalVisibility(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
