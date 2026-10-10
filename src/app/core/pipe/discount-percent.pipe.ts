import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountPercent'
})
export class DiscountPercentPipe implements PipeTransform {
transform(salePrice: number, originalPrice: number): number {
    if (!originalPrice || originalPrice <= 0 || !salePrice || salePrice >= originalPrice) {
      return 0;
    }
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  }

}
