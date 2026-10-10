import {
  Component,
  computed,
  effect,
  inject,
  Input,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { map } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { ProductCategory } from '../admin.component';
import { IProduct } from '../../../core/models/api';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../../enviroments/environment';

@Component({
  selector: 'tr[app-table-admin]',
  imports: [MatIcon, CurrencyPipe],
  templateUrl: './table-admin.component.html',
  styleUrl: './table-admin.component.css',
})
export class TableAdminComponent implements OnInit {
  private productService = inject(ProductService);
  localhost = environment.baseUrl;
  deleteMessage = output<string>();
  category = input<string | 'all' | undefined>('');
  editModel = output<any>();
  product = input<any>();
  isModalOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  activeCategoryFilter = signal<ProductCategory | 'All'>('All');
  searchQuery = signal<string>('');
  categories: ProductCategory[] = ['perfumes', 'balloons', 'gifts', 'deals'];
  formProduct = signal<IProduct>(this.getEmptyProduct());
  products = signal<IProduct>(this.getEmptyProduct());
  closeModal = signal<boolean>(true);
    
  
  ngOnInit(): void {}

  openEditModal(product: IProduct) {
    this.formProduct.update(() => ({ ...product }));
    this.editModel.emit(product);
    this.isModalOpen.set(true);
  }

  getEmptyProduct(): IProduct {
    return {
      _id: Date.now().toString(),
      name: '',
      category: 'perfumes',
      price: 0,
      image: [
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500',
      ],
      concentration: '',
      colorPalette: [],
      boxContents: [],
      occasion: '',
      tags: [''],
      active: true,
    };
  }

  toggleActive(product: IProduct | undefined) {
    if (!product || !product._id) return;

    const newStatus = !product.active;
    this.productService
      .updateProduct(product._id, { active: newStatus })
      .subscribe({
        next: (res) => {
          product.active = newStatus;
        },
        error: (err) => console.error(' ERROR IN TOGGLE ACTIVE ', err),
      });
  }

  deleteProduct(id: string) {
    let isDeleted = confirm('do you want to delete this product');

    if (isDeleted)
      this.productService
        .deleteProduct(id)
        .pipe(map((res) => res.message))
        .subscribe((res) => this.deleteMessage.emit(res as any));
  }

  closeEditModal() {
    this.closeModal.set(false);
  }
}
