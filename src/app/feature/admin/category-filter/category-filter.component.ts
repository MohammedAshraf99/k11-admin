import {
  Component,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-category-filter',
  imports: [FormsModule, RouterLink],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.css',
})
export class CategoryFilterComponent implements OnInit {
  private productCount = inject(ProductService);
  activeCategoryFilter = signal<string | 'all'>('all');
 specCategory = output<string>()
  categories = signal<{ category: string | 'all', count: number }[]>([
    { category: 'all', count: 0 },
  ]);

  ngOnInit(): void {
    this.Count();
  }

  Count() {
    this.productCount.productCount().subscribe((res) => {
      this.categories.set(res.data);
    });
  }
}
