import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Order } from '../../../core/models/api';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-checkoutlist',
  imports: [MatIcon, FormsModule, CurrencyPipe],
  templateUrl: './checkoutlist.component.html',
  styleUrl: './checkoutlist.component.css',
})
export class CheckoutlistComponent implements OnInit {
  private orderServices = inject(OrderService)
  
  orders = signal<Order[]>([]);
  searchQuery = signal<string>('');
  selectedOrder = signal<Order | null>(null);

  // Metrics computed from Mongoose documents
  totalRevenue = computed(() =>
    this.orders().reduce((sum, order) => sum + order.amount, 0),
  );

  totalOrdersCount = computed(() => this.orders().length);

  // Search filter matching orderID, name, email, or payerId
  filteredOrders = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    return this.orders().filter((order) => {
      return (
        order.orderID.toLowerCase().includes(query) ||
        order.customerInfo.name.toLowerCase().includes(query) ||
        order.customerInfo.email.toLowerCase().includes(query) ||
        order.customerInfo.payerId.toLowerCase().includes(query)
      );
    });
  });

  ngOnInit(): void {
    this.orderServices.getOrders().subscribe(res=> this.orders.set(res.data))
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder.set(order);
  }

  closeDetailsModal(): void {
    this.selectedOrder.set(null);
  }
}
