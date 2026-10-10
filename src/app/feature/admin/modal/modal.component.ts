import {
  Component,
  computed,
  inject,
  input,
  Input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ProductCategory } from '../admin.component';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../core/models/api';
import { ProductsService } from '../../../services/products.service';
import { environment } from '../../../../enviroments/environment';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatIcon, FormsModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  close = output<boolean>();
  message = output<string>();
  productData = input<IProduct>();
  newBoxContent = signal<string>('');
  newColorHex = signal<string>('#f43f5e');
  categories: string[] = ['perfumes', 'balloons', 'gifts', 'roses'];
  submitted = false;
  selectedFiles: File[] = [];
  localhost = environment.baseUrl;
  private productService = inject(ProductsService);
  isEditMode = computed(() => !!this.productData());
  
formProduct = linkedSignal<IProduct>(() => {
    const data = this.productData();
    return data ? { ...data } : this.getEmptyProduct();
  });

  getEmptyProduct(): IProduct {
    return {
      name: '',
      active: true,
      category: 'perfumes',
      price: 0,
      description: '',
      image: [],
      tags: [],
      colorPalette: [],
      boxContents: [],
      size: '',
      isSale: false,
      deal: false,
      concentration: '',
    };
  }

  closeModal() {
    this.close.emit(false);
  }

  toggleSale() {
    this.formProduct.update((prod) => ({
      ...prod,
      isSale: !prod.isSale,
    }));
  }

  toggleDeal() {
    this.formProduct.update((prod) => ({
      ...prod,
      deal: !prod.deal,
    }));
  }

  // Size Controls (Perfumes)
  // addSize(val: string) {
  //   const trimmed = val.trim();
  //   if (!trimmed) return;
  //   this.formProduct.update((prod) => ({
  //     ...prod,
  //     size: [...(prod.size || []), trimmed]
  //   }));
  // }

  // removeSize(index: number) {
  //   this.formProduct.update((prod) => ({
  //     ...prod,
  //     size: (prod.size || []).filter((_, i) => i !== index)
  //   }));
  // }

  // Box Contents Controls (Gifts)
  addBoxContent() {
    const val = this.newBoxContent().trim();
    if (!val) return;
    this.formProduct.update((prod) => ({
      ...prod,
      boxContents: [...(prod.boxContents || []), val],
    }));
    this.newBoxContent.set('');
  }

  removeBoxContent(index: number) {
    this.formProduct.update((prod) => ({
      ...prod,
      boxContents: (prod.boxContents || []).filter((_, i) => i !== index),
    }));
  }

  // Color Palette Controls (Balloons)
  addColorHex() {
    const hex = this.newColorHex();
    this.formProduct.update((prod) => ({
      ...prod,
      colorPalette: [...(prod.colorPalette || []), hex],
    }));
  }

  removeColorHex(index: number) {
    this.formProduct.update((prod) => ({
      ...prod,
      colorPalette: (prod.colorPalette || []).filter((_, i) => i !== index),
    }));
  }

  // Tags Controls
  addTag(val: string) {
    const trimmed = val.trim();
    if (!trimmed) return;
    this.formProduct.update((prod) => ({
      ...prod,
      tags: [...(prod.tags || []), trimmed],
    }));
  }

  removeTag(index: number) {
    this.formProduct.update((prod) => ({
      ...prod,
      tags: (prod.tags || []).filter((_, i) => i !== index),
    }));
  }

  // File Selection & Upload
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const formData = new FormData();

    files.forEach((file) => {
      this.selectedFiles.push(file);
      formData.append('images', file);
    });

    this.productService.uploadImage(formData).subscribe({
      next: (response) => {
        const uploadedImages = Array.isArray(response.imageUrl)
          ? response.imageUrl
          : [response.imageUrl];

        this.formProduct.update((prod) => ({
          ...prod,
          image: [...(prod.image || []), ...uploadedImages],
        }));
      },
      error: (err) => console.error('حدث خطأ أثناء رفع الصور:', err),
    });

    input.value = '';
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.formProduct.update((prod) => ({
      ...prod,
      image: (prod.image || []).filter((_, i) => i !== index),
    }));
  }

  validateForm(): boolean {
    const prod = this.formProduct();

    if (!prod.category || !prod.name || !prod.price || prod.price <= 0) {
      return false;
    }

    if (!prod.image || prod.image.length === 0) {
      return false;
    }

    if (prod.isSale && (!prod.salePrice || prod.salePrice <= 0)) {
      return false;
    }

    // if (prod.category === 'perfumes') {
    //   if (!prod.concentration || !prod.size || prod.size.length === 0) return false;
    // }

    if (prod.category === 'gifts') {
      if (!prod.occasion) return false;
    }

    return true;
  }

  saveProduct() {
    this.submitted = true;

    if (!this.validateForm()) {
      return;
    }

    if (this.isEditMode()) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct() {
    const payload = {
      ...this.formProduct(),
    };

    this.productService.createProduct(payload).subscribe({
      next: (res) => {
        this.message.emit(res.message || 'Product created successfully');
        this.closeModal();
      },
      error: (err) => console.error('Error creating product:', err),
    });
  }

  updateProduct() {
    const payload = this.formProduct();
    if (!payload._id) return;
    this.productService.updateProduct(payload._id, payload as any).subscribe({
      next: (res) => {
        this.message.emit(res.message || 'Product updated successfully');
        this.closeModal();
      },
      error: (err) => console.error('Error updating product:', err),
    });
  }
}
