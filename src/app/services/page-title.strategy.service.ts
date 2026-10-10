import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageTitleStrategyService extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      // Appends " | My Application" to every route title
      this.title.setTitle(`${title} | K11`);
    } else {
      // Default fallback title when a route has no title defined
      this.title.setTitle('K11');
    }
  }
}
