import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { map } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { ToasterService } from '../../../services/toaster.service';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { ModalComponent } from '../modal/modal.component';
import { TableAdminComponent } from '../table-admin/table-admin.component';
import { IProduct } from '../../../core/models/api';
export type ProductCategory = 'perfumes' | 'balloons' | 'gifts' | 'deals';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatIcon,
    FormsModule,
    TableAdminComponent,
    ModalComponent,
    CategoryFilterComponent,
  ],
  templateUrl: './product-admin.component.html',
  styleUrl: './product-admin.component.css',
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);
  private toasterService = inject(ToasterService);
  categories: ProductCategory[] = ['perfumes', 'balloons', 'gifts', 'deals'];
  activeCategoryFilter = signal<ProductCategory | 'All'>('All');
  searchQuery = signal<string>('');
  products = signal<IProduct[]>([]);
  isModalOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  ngOnInit() {
    this.allProducts();
  }
  selectedProduct = signal<any | null>(null);

  categoryProducts(category: string) {
    if (category === 'all') {
      this.allProducts();
    } else {
      this.productService
        .categoryProducts(category)
        .pipe(map((res) => res.data.reverse()))
        .subscribe((data) => {
          this.products.set(data);
        });
    }
  }

  allProducts() {
    this.productService
      .Products()
      .pipe(map((res) => res.data.reverse()))
      .subscribe((data) => {
        this.products.set(data as any);
      });
  }

  editProduct(e: any) {
    console.log(e);
  }

  openAddModal() {
    this.selectedProduct.set(null); 
    this.isModalOpen.set(true);
  }


  
  
  
  closeModal(e: any) {
    this.isModalOpen.set(false);
    this.selectedProduct.set(null);
    console.log('ds');
    this.isModalOpen.set(false);
  }
 
 
  openEditModal(productData: any) {
    this.isEditMode.set(true);
    this.selectedProduct.set(productData); 
    // Deep clone to prevent direct state mutation
    this.isModalOpen.set(true);
  }

}
