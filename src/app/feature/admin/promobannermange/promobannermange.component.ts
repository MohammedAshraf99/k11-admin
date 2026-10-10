import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PromoBanner } from '../../../core/models/api';
import { PromoBannerService } from '../../../services/promo-banner.service';
import { map } from 'rxjs';
import { environment } from '../../../../enviroments/environment';

@Component({
  selector: 'app-promobannermange',
  imports: [FormsModule],
  templateUrl: './promobannermange.component.html',
  styleUrl: './promobannermange.component.css',
})
export class PromobannermangeComponent {
  private bannerService = inject(PromoBannerService);
  localhost = environment.baseUrl;
  // States using Signals
  banners = signal<PromoBanner[]>([]);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  deletingId = signal<string | null>(null);

  // Modal Control
  isModalOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  // Active Selected File & Form Data State
  selectedFile: File | null = null;
 // States using Signals
 
  formBanner = signal<PromoBanner>({
    title: '',
    subtitle: '',
    description: '',
    discountText: '',
    ctaText: 'Explore Collection',
   ctaLink: '/perfumes',
    imageUrl: ''
  });

  ngOnInit(): void {
    this.fetchBanners();
  }

  fetchBanners(): void {
    this.isLoading.set(true);
    this.bannerService.getBanners().pipe(map((res) => res.data)).subscribe({
      next: (data) => {
        this.banners.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching banners:', err);
        this.isLoading.set(false);
      }
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.selectedFile = null;
    this.formBanner.set({
      title: '',
      subtitle: '',
      description: '',
      discountText: '',
      ctaText: 'Explore Collection',
     ctaLink: '/perfumes',
      imageUrl: ''
    });
    this.isModalOpen.set(true);
  }

  openEditModal(banner: PromoBanner): void {
    this.isEditMode.set(true);
    this.selectedFile = null;
    this.formBanner.set({ ...banner });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  saveBanner(): void {
    const currentData = this.formBanner();

    if (!currentData.title || !currentData.description) {
      alert('Title and Description are required!');
      return;
    }

    if (!this.isEditMode() && !this.selectedFile) {
      alert('Please select an image for the banner.');
      return;
    }

    this.isSaving.set(true);

    const formData = new FormData();
    formData.append('title', currentData.title);
    formData.append('subtitle', currentData.subtitle || '');
    formData.append('description', currentData.description);
    formData.append('discountText', currentData.discountText || '');
    formData.append('buttonText', currentData.ctaText || 'Explore Collection');
    formData.append('buttonLink', currentData.ctaLink|| '/perfumes');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode() && currentData._id) {
      this.bannerService.updateBanner(currentData._id, formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.fetchBanners();
        },
        error: (err) => {
          console.error('Error updating banner:', err);
          this.isSaving.set(false);
        }
      });
    } else {
      this.bannerService.createBanner(formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.fetchBanners();
        },
        error: (err) => {
          console.error('Error creating banner:', err);
          this.isSaving.set(false);
        }
      });
    }
  }

  deleteBanner(id?: string): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this banner?')) return;

    this.deletingId.set(id);
    this.bannerService.deleteBanner(id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.fetchBanners();
      },
      error: (err) => {
        console.error('Error deleting banner:', err);
        this.deletingId.set(null);
      }
    });
  }
}