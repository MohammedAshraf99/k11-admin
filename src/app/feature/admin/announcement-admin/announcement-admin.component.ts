import { Component, inject, OnInit, signal } from '@angular/core';
import { Announcement } from '../../../core/models/api';
import { AnnouncmentService } from '../../../services/announcment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-announcement-admin',
  imports: [DatePipe],
  templateUrl: './announcement-admin.component.html',
  styleUrl: './announcement-admin.component.css',
})
export class AnnouncementAdminComponent implements OnInit {
  private announcementService = inject(AnnouncmentService);

  announcements = signal<Announcement[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedId = signal<string | null>(null);
  formData: Announcement = this.getResetForm();

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.isLoading.set(true);
    this.announcementService.getAllAnnouncements().subscribe({
      next: (res) => {
        this.announcements.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching announcements:', err);
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedId.set(null);
    this.formData = this.getResetForm();
    this.isModalOpen.set(true);
  }

  openEditModal(item: Announcement): void {
    this.isEditMode.set(true);
    this.selectedId.set(item._id || null);

    // Format dates for input[type="date"]
    const startDateFormatted = item.startDate
      ? new Date(item.startDate).toISOString().split('T')[0]
      : '';
    const endDateFormatted = item.endDate
      ? new Date(item.endDate).toISOString().split('T')[0]
      : '';

    this.formData = {
      text: item.text,
      link: item.link || '',
      active: item.active ?? true,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
    };

    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  saveAnnouncement(): void {
    if (!this.formData.text || !this.formData.endDate) {
      alert('Please fill in the announcement text and end date.');
      return;
    }

    this.isSubmitting.set(true);

    if (this.isEditMode() && this.selectedId()) {
      this.UpdateAnnoucement();
    } else {
      // Add new
      this.announcementService.createAnnouncement(this.formData).subscribe({
        next: () => {
          this.loadAnnouncements();
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          alert('An error occurred while adding the announcement.');
          this.isSubmitting.set(false);
        },
      });
    }
  }

  UpdateAnnoucement(){
    // Edit existing
    this.announcementService
      .updateAnnouncement(this.selectedId()!, this.formData)
      .subscribe({
        next: () => {
          this.loadAnnouncements();
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          alert('An error occurred while updating the announcement.');
          this.isSubmitting.set(false);
        },
      });
  }

  deleteAnnouncement(id: string): void {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcementService.deleteAnnouncement(id).subscribe({
        next: () => {
          this.announcements.update((list) =>
            list.filter((item) => item._id !== id),
          );
        },
        error: (err) => alert('Failed to delete the announcement.'),
      });
    }
  }

  toggleActiveStatus(item: Announcement): void {
    if (!item._id) return;
    const updatedStatus = !item.active;

    this.announcementService
      .updateAnnouncement(item._id, { active: updatedStatus })
      .subscribe({
        next: () => {
          this.announcements.update((list) =>
            list.map((ann) =>
              ann._id === item._id ? { ...ann, active: updatedStatus } : ann,
            ),
          );
        },
      });
  }

  private getResetForm(): Announcement {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    return {
      text: '',
      link: '',
      active: true,
      startDate: today,
      endDate: nextWeek,
    };
  }
}
