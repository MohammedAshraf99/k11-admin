import { Injectable, signal } from '@angular/core';
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}
@Injectable({
  providedIn: 'root',
})
export class ToasterService {
// Read-only public exposition of the signal array sequence
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: ToastType = 'info', duration = 3000): void {
    const id = this.nextId++;
    
    // Efficiently push elements to our reactive signal stream state
    this.toasts.update(current => [...current, { id, message, type }]);

    // Auto-destruct scheduler
    setTimeout(() => this.clear(id), duration);
  }

  clear(id: number): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
