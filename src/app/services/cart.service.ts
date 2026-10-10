import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse, Cart } from '../core/models/api';
import { Injectable, inject, signal } from '@angular/core';
import { GuestUserService } from './guest-user.service';
import { environment } from '../../enviroments/environment';

export interface AddToCartPayload {
  guestId?: string;
  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private guestUserService = inject(GuestUserService);

  private apiUrl = environment.apiUrl+'/cart';

  getguestId() {
    this.guestUserService.getGuestId();
  }

  // حالة السلة الحالية للوصول السريع والتحديث التلقائي في الشاشات
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  private cartItemCount = new BehaviorSubject<number | null>(0);
  public cartCount$ = this.cartItemCount.asObservable();
  public cart$ = this.cartSubject.asObservable();

  // Signal لحساب إجمالي عدد العناصر المضافة للسلة للـ Badge في الـ Navbar

  /**
   * جلب محتويات السلة الخاصة بالمستخدم
   */
  getCart(): Observable<ApiResponse<Cart>> {
  this.guestUserService.guestId();
    return this.http
      .get<
        ApiResponse<Cart>
      >(this.apiUrl, {
        params: {
          guestId: this.guestUserService.guestId() ?? '',
        },
      })
      .pipe(
        tap((response) => {
          this.cartItemCount.next(response.data.totalItems!);
          this.updateCartState(response.data);
        }),
      );
  }

  cartCount(): Observable<{ count: number }> {


    return this.http
      .get<{
        count: number;
      }>(this.apiUrl + '/count', {
        params: { guestId: this.guestUserService.guestId() ?? '' },
      })
      .pipe(
        tap((res) => {
          this.cartItemCount.next(res.count);
        }),
      );
  }

  /**
   * إضافة عنصر جديد إلى السلة
   */
  addToCart(payload: AddToCartPayload): Observable<ApiResponse<Cart>> {
    return this.http
      .post<ApiResponse<Cart>>(this.apiUrl, payload)
      .pipe(tap((response) => this.updateCartState(response.data)));
  }

  /**
   * تعديل كمية عنصر محدد داخل السلة
   */
  updateCartItemQuantity(
    itemId: string,
    quantity: number,
  ): Observable<ApiResponse<Cart>> {
    return this.http
      .put<ApiResponse<Cart>>(`${this.apiUrl}/items/${itemId}`, { quantity })
      .pipe(tap((response) => this.updateCartState(response.data)));
  }

    updateCartCoupon(
    coupon: string,
  ): Observable<ApiResponse<Cart>> {
    return this.http
      .put<ApiResponse<Cart>>(`${this.apiUrl}`, { coupon })
  }
  /**
   * حذف عنصر محدد من السلة
   */
  removeFromCart(itemId: string): Observable<ApiResponse<Cart>> {
    return this.http
      .delete<ApiResponse<Cart>>(`${this.apiUrl}/items/${itemId}`)
      .pipe(tap((response) => this.updateCartState(response.data)));
  }

  /**
   * تفريغ السلة بالكامل
   */
  clearCart(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(this.apiUrl).pipe(
      tap(() => {
        this.cartSubject.next(null);
        this.cartItemCount.next(0);
      }),
    );
  }

  /**
   * تحديث الـ State الداخلي للسلة وحساب إجمالي الأغراض
   */
  private updateCartState(cart: Cart) {
    this.cartSubject.next(cart);
    const totalCount =
      cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    this.cartItemCount.next(totalCount);
  }
}
