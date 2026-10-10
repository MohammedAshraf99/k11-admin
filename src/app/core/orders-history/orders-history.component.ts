import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../models/api';

@Component({
  selector: 'app-orders-history',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.css',
})
export class OrdersHistoryComponent {
  private orderService = inject(OrderService);
  orders = signal<any[]>([]);
  selectedOrder = signal<Order | null>(null);
  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.orders.set(res.data);
        }
      },
      error: (err) => console.error('خطأ في جلب سجل الطلبات:', err),
    });
  }
}
