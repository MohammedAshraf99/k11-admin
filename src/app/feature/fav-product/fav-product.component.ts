import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ToasterService } from '../../services/toaster.service';
import { CurrencyPipe } from '@angular/common';
import { EmptyComponent } from '../empty/empty.component';

export interface PerfumeProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

@Component({
  selector: 'app-fav-product',
  imports: [MatIcon, EmptyComponent],
  standalone: true,
  templateUrl: './fav-product.component.html',
  styleUrl: './fav-product.component.css',
})
export class FavProductComponent {
  private readonly toastService = inject(ToasterService);

  // Core reactive store state containing user's bookmarked items
  readonly favorites = signal<PerfumeProduct[]>([
    {
      id: 101,
      name: 'Royal Oud Intense',
      brand: 'OudShop Signature',
      price: 145.0,
      imageUrl:
        'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=400&q=80',
      inStock: true,
    },
    {
      id: 102,
      name: 'Pure White Musk',
      brand: 'Al-Rehab Elegance',
      price: 89.99,
      imageUrl:
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80',
      inStock: true,
    },
    {
      id: 103,
      name: 'Mystic Amber Fusion',
      brand: 'Arabian Nights',
      price: 120.0,
      imageUrl:
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80',
      inStock: false,
    },
  ]);

  // Reactive state trackers for quick UI updates
  readonly hasFavorites = computed(() => this.favorites().length > 0);
  readonly totalCount = computed(() => this.favorites().length);

  // Fallback cache allowing immediate data restoration if a user accidentally removes a favorite
  private lastRemovedItem: { item: PerfumeProduct; index: number } | null =
    null;

  handleRemoveFromFavorites(productId: number): void {
    const currentList = this.favorites();
    const targetIndex = currentList.findIndex((p) => p.id === productId);

    if (targetIndex === -1) return;

    // Cache item states before filtering them out
    this.lastRemovedItem = {
      item: currentList[targetIndex],
      index: targetIndex,
    };

    // Update signal state atomically
    this.favorites.set(currentList.filter((p) => p.id !== productId));

    this.toastService.show(
      `Removed "${this.lastRemovedItem.item.name}" from wishlist.`,
      'info',
      4000,
    );
  }

  handleAddToCart(product: PerfumeProduct): void {
    if (!product.inStock) return;

    // Add logic here to interface with your main CartService state
    this.toastService.show(
      `Added ${product.name} to your shopping bag!`,
      'success',
    );
  }
}
