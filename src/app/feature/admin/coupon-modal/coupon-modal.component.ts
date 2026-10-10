import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CouponService } from '../../../services/coupon.service';
import { Coupon, PromoSettings } from '../../../core/models/api';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-coupon-modal',
  imports: [ReactiveFormsModule, FormsModule, CurrencyPipe, NgClass],
  templateUrl: './coupon-modal.component.html',
  styleUrl: './coupon-modal.component.css',
})
export class CouponModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private couponService = inject(CouponService);

  // Data signals
  coupons = signal<Coupon[]>([]);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  deletingId = signal<string | null>(null);

  // Modal control signals
  isModalOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedCouponId = signal<string | null>(null);

  // Reactive Form
  couponForm = this.fb.nonNullable.group({
    code: ['', [Validators.required]],
    discountType: [
      'percentage' as 'percentage' | 'fixed',
      [Validators.required],
    ],
    discountValue: [0, [Validators.required, Validators.min(1)]],
    minOrderAmount: [0, [Validators.min(0)]],
    maxDiscountAmount: [null as number | null],
    expirationDate: ['', [Validators.required]],
    usageLimit: [null as number | null],
    isActive: [true],
    isPromoModal: [false],
  });

  ngOnInit(): void {
    this.loadAllCoupons();
  }

  /**
   * Fetch all coupons for the table
   */
  loadAllCoupons(): void {
    this.isLoading.set(true);
    this.couponService.getAllCoupons().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.coupons.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  /**
   * Open modal for creating a new coupon
   */
  openAddModal(): void {
    this.isEditMode.set(false);
    this.selectedCouponId.set(null);
    this.couponForm.reset({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscountAmount: null,
      expirationDate: '',
      usageLimit: null,
      isActive: true,
      isPromoModal: false,
    });
    this.isModalOpen.set(true);
  }

  /**
   * Open modal for editing an existing coupon
   */
  openEditModal(coupon: Coupon): void {
    this.isEditMode.set(true);
    this.selectedCouponId.set(coupon._id || null);

    const expDate = coupon.expirationDate
      ? new Date(coupon.expirationDate).toISOString().split('T')[0]
      : '';

    this.couponForm.patchValue({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount || null,
      expirationDate: expDate,
      usageLimit: coupon.usageLimit || null,
      isActive: coupon.isActive,
      isPromoModal: coupon.isPromoModal || false,
    });

    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  /**
   * Submit create or update action
   */
  saveCoupon(): void {
    if (this.couponForm.invalid) {
      this.couponForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValues = this.couponForm.getRawValue();

    const payload: Partial<Coupon> = {
      ...formValues,
      code: formValues.code.toUpperCase().trim(),
      maxDiscountAmount: formValues.maxDiscountAmount ?? undefined,
      usageLimit: formValues.usageLimit ?? undefined,
    };

    const request =
      this.isEditMode() && this.selectedCouponId()
        ? this.couponService.updateCoupon(this.selectedCouponId()!, payload)
        : this.couponService.createCoupon(payload);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeModal();
        this.loadAllCoupons();
      },
      error: () => this.isSaving.set(false),
    });
  }

  /**
   * Delete a coupon
   */
  deleteCoupon(id: string): void {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    this.deletingId.set(id);
    this.couponService.deleteCoupon(id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.loadAllCoupons();
      },
      error: () => this.deletingId.set(null),
    });
  }
}
