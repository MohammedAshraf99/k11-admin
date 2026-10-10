import { Routes } from '@angular/router';
import { AdminComponent } from '././feature/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent, title: 'admin' },
  {
    path: 'admin',
    component:AdminComponent,
  children:[
    {
      path: 'banner',
      loadComponent: () =>
        import('./feature/admin/banner/banner.component').then((m) => m.BannerComponent),
    },
    {
      path: 'promo-banner',
      
      loadComponent: () =>
        import('./feature/admin/promobannermange/promobannermange.component').then(
          (m) => m.PromobannermangeComponent,
        ),
      },
      {
        path: 'checkout-list',
        
        loadComponent: () =>
          import('./feature/admin/checkoutlist/checkoutlist.component').then(
            (m) => m.CheckoutlistComponent,
          ),
        },
        
        
        {
          path: 'products/:id',
          loadComponent: () =>
            import('./feature/admin/product-admin/product-admin.component').then(
              (m) => m.ProductComponent,
            ),
          },
          {
            path: 'announcement',
            loadComponent: () =>
              import('./feature/admin/announcement-admin/announcement-admin.component').then(
                (m) => m.AnnouncementAdminComponent,
              ),
            },
            
         {
           path: 'coupon',
           loadComponent: () =>
            import('./feature/admin/coupon-modal/coupon-modal.component').then(
              (c) => c.CouponModalComponent,
            ),
          },
        ] }   
    
];
