import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isNewThisWeek'
})
export class IsNewThisWeekPipe implements PipeTransform {
 transform(updatedAt: string | Date): boolean {
    if (!updatedAt) return false;
    
    const updatedTime = new Date(updatedAt).getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    
    return (Date.now() - updatedTime) < sevenDaysInMs;
  
  }

}
