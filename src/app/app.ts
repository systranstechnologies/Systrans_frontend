import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  protected readonly navOpen = signal(false);
  protected readonly isNavigating = signal(false);
  protected readonly currentYear = new Date().getFullYear();

  protected readonly navItems = [
    { label: 'Home', path: '/home' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Products', path: '/products' },
    { label: 'Industries', path: '/industries' },
    { label: 'Technologies', path: '/technologies' },
    { label: 'Careers', path: '/careers' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  constructor() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError),
      takeUntilDestroyed(),
    ).subscribe((event) => {
      this.isNavigating.set(event instanceof NavigationStart);
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.navOpen.set(false);
      }
    });
  }

  protected toggleNav(): void {
    this.navOpen.update((value) => !value);
  }

  protected closeNav(): void {
    this.navOpen.set(false);
  }
}
