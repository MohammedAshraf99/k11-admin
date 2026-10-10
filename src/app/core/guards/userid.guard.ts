import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { ObjectId } from 'bson';
import { GuestUserService } from '../../services/guest-user.service';

export const useridGuard: CanMatchFn = (route, segments) => {
  const authService = inject(GuestUserService);
  const userId = authService.getGuestId();
  const router = inject(Router);

  if (ObjectId.isValid(userId)) {
    console.log(ObjectId.isValid(userId));
    setTimeout(() => {
      router.navigate(['/checkout']);
    }, 2000);

    return ObjectId.isValid(userId);
  }
  return true;
};
