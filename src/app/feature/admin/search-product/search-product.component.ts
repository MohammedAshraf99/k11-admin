import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-search-product',
  imports: [MatIcon,FormsModule],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.css'
})
export class SearchProductComponent {
  categories = input.required<string[]>();
  activeCategory = input.required<string>();
  searchQuery = input.required<string>();
  categoryCounts = input.required<Record<string, number>>();

  // Outputs using Angular Signals API
  activeCategoryChange = output<string>();
  searchQueryChange = output<string>();
  onAddProduct = output<void>();
}
