import { Injectable, signal } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {
private readonly STORAGE_KEY = 'app_guest_user_id';
private guestIdSignal = signal<string | null>(this.getGuestIdFromStorage());
  public readonly guestId = this.guestIdSignal.asReadonly();


  constructor() {
    // Listen to changes made in OTHER browser tabs/windows
    fromEvent<StorageEvent>(window, 'storage').subscribe((event) => {
      if (event.key === this.STORAGE_KEY) {
        this.updateState(event.newValue);
      }
    });
  }
getGuestId$(): string | null {
    return this.guestIdSignal();
  }

  private getGuestIdFromStorage(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  private updateState(value: string | null): void {
    this.guestIdSignal.set(value);
  }
  
  // حفظ الـ ID في Signal لسهولة الاستخدام والتفاعل
  visitorId = signal<string>(this.initVisitorId());

  private initVisitorId(): string {
    let id = localStorage.getItem(this.STORAGE_KEY);
    if (!id) {
      id = 'guest_' + crypto.randomUUID(); // طريقة أحدث وأسرع في المتصفحات الحديثة
      localStorage.setItem(this.STORAGE_KEY, id);
    }
    return id;
  }

  getGuestId(): string {
    return this.visitorId();
  }


  setGuestId(id: string): string {
    localStorage.setItem(this.STORAGE_KEY, id);
    this.updateState(id);
    return this.visitorId();
  }
}
