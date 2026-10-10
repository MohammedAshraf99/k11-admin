import { Component, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
  import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToasterComponent } from './feature/toaster/toaster.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private route = inject(Router);
  isLoading = signal(false);
  constructor() {
   this.route.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((val: any) => {
      
      this.isLoading.set(val.url.includes('admin'));
    });
  }
  
  title = 'k11';
}
