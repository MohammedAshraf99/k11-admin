import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { GuestUserService } from './guest-user.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
 private token  = inject(GuestUserService); 
  private apiUrl = environment.apiUrl+'/payments';

  createPaypalOrder(amount: number): Observable<{ success: boolean; orderID: string }> {
    return this.http.post<{ success: boolean; orderID: string }>(`${this.apiUrl}/paypal/create-order`, { amount },{headers:{Authorization:environment.PAYPAL_CLIENT_SECRET
    }});
  }

  // إرسال orderID مع بيانات الشحن وحساب المستخدم/الزائر
  captureAndCreateOrder(payload: { orderID: string; shippingAddress: any; guestId?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/paypal/capture-order`, payload);
  }
}