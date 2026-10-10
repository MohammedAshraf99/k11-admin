import { Component, inject, OnInit, signal } from '@angular/core';
import { Banner } from '../../../core/models/api';
import { BannerService } from '../../../services/banner.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-banner',
  imports: [FormsModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent implements OnInit {
  private bannerService = inject(BannerService);

  banners = signal<Banner[]>([]);
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  deletingId = signal<string | null>(null);

  isModalOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  formBanner = signal<Partial<Banner>>({
    title: '',
    subtitle: '',
    discountTag: '',
    ctaLink: '/perfumes',
    ctaText: 'SHOP NOW',
  });

  selectedFile: File | null = null;

  ngOnInit(): void {
    this.fetchBanners();
  }

  fetchBanners(): void {
    this.isLoading.set(true);
    this.bannerService.getBanners().subscribe({
      next: (res) => {
        console.log(res.data.length)
        
        if (res.success) this.banners.set(res.data);
      },
      error: (err) => console.error(err),
      complete: () => this.isLoading.set(false),
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.formBanner.set({
      title: '',
      subtitle: '',
      discountTag: '',
      ctaLink: '/perfumes',
      ctaText: 'SHOP NOW',
    });
    this.selectedFile = null;
    this.isModalOpen.set(true);
  }

  openEditModal(banner: Banner): void {
    this.isEditMode.set(true);
    this.formBanner.set({ ...banner });
    this.selectedFile = null;
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  saveBanner(): void {
    const data = this.formBanner();
    if (!this.isEditMode() && !this.selectedFile) {
      alert('kindly choose a photo for banner !');
      return;
    }

    if (!data.title) {
      alert('title required');
      return;
    }

    this.isSaving.set(true);
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('subtitle', data.subtitle || '');
    formData.append('discountTag', data.discountTag || '');
    formData.append('ctaLink', data.ctaLink || '/perfumes');
    formData.append('ctaText', data.ctaText || 'SHOP NOW');

    if (this.selectedFile) {
      console.log(this.selectedFile);
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode() && data._id) {
      this.bannerService.updateBanner(data._id, formData).subscribe({
        next: (res) => {
          if (res.success) {
            this.banners.update((items) =>
              items.map((item) => (item._id === data._id ? res.data : item)),
            );
            this.closeModal();
          }
        },
        error: (err) => alert(' error on editing banner '),
        complete: () => this.isSaving.set(false),
      });
    } else {
      this.bannerService.createBanner(formData).subscribe({
        next: (res) => {
          if (res.success) {
            this.banners.update((items) => [...items, res.data]);
            this.closeModal();
          }
        },
        error: (err) => alert(' ERROR IN ADDING '),
        complete: () => this.isSaving.set(false),
      });
    }
  }

  deleteBanner(id: string): void {
    if (!confirm('ARE YOU SURE ABOUT DELETING THIS PHOTO ?')) return;

    this.deletingId.set(id);
    this.bannerService.deleteBanner(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.banners.update((items) =>
            items.filter((item) => item._id !== id),
          );
        }
      },
      error: (err) => alert(' ERROR IN DELETING '),
      complete: () => this.deletingId.set(null),
    });
  }
}
