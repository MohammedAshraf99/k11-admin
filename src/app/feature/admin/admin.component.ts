import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
export type ProductCategory = 'perfumes' | 'balloons' | 'gifts' | 'deals';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ 
    FormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet

  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {

  ngOnInit() {

  }

}
