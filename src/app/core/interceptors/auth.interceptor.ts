import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GuestUserService } from '../../services/guest-user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userID = inject(GuestUserService);

  let headers = req.headers;
  const guestId = userID.getGuestId();
  const genGuestId = userID.visitorId();
  if (guestId) {
    // إذا كنت تستخدم Guest ID قم بإرساله في Header مخصص
    headers = headers.set('x-guest-id', guestId);
  } else {
    headers = headers.set('x-guest-id', genGuestId);
  }

  const authReq = req.clone({ headers });

  return next(authReq);
};
