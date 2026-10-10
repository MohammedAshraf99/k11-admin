import { Component, inject, model, output, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GuestUserService } from '../../services/guest-user.service';
import { map } from 'rxjs';

export interface UserDetails {
  name: string;
  phoneNumber: string;
  address: string;
}

@Component({
  selector: 'app-user-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css',
})
export class UserModalComponent {
  private fb = inject(FormBuilder);
  isOpen = model<boolean>(false);
  private router = inject(Router);
  private userService = inject(UserService);
  private GuestUserService = inject(GuestUserService);

  // Output event emitted when user submits data
  formSubmitted = output<UserDetails>();

  // Reactive Form Definition
  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern('^[0-9+\\-\\s()]{7,15}$')],
    ],
    address: ['', Validators.required],
  });
  getuserData() {
    console.log(this.userForm.value);
  }

  openModal(): void {
    this.userForm.reset();
    this.isOpen.set(true);
  }

  closeModal(): void {
    this.isOpen.set(false);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: UserDetails = this.userForm.value;
      this.userService
        .createUser(userData)
        .pipe(map((response: any) => response.user))
        .subscribe((response) => {
          this.GuestUserService.setGuestId(response._id);
          localStorage.setItem('userId', response._id);
          this.router.navigate(['/checkout']);
        });
      this.formSubmitted.emit(userData);
      this.closeModal();
    }
  }
}
