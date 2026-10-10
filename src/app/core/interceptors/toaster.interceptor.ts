import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';

export const toasterInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToasterService);

  return next(req).pipe(
    tap((event) => {
      // 1. Strict Filter: ONLY execute when the server completes the response
      if (event.type === HttpEventType.Response) {
        // 2. Filter for state-changing methods (POST, PUT, DELETE, PATCH)
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
          // 3. Catch the backend response message
          // Expecting backend body like: { message: "Item added successfully", data: ... }
          const responseBody = event.body as { message?: string } | null;
          const successMessage = responseBody?.message!;
        if(!successMessage){
        return;
        }
        toastService.show(successMessage, 'success');
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Catch backend error response message
      const errorMessage =
        error.error?.message || 'An unexpected error occurred';

      toastService.show(errorMessage, 'error');
      return throwError(() => error);
    }),
  );
};
