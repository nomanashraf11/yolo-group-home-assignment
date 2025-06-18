import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="navbar-logo">
        <a routerLink="/" class="logo-link">
          <img src="/assets/icons/yolo.svg" alt="Logo" class="logo-img" />
        </a>
      </div>

      <button
        class="hamburger-menu"
        (click)="toggleMobileMenu()"
        [class.active]="isMobileMenuOpen"
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul class="nav-links" [class.mobile-open]="isMobileMenuOpen">
        <li>
          <a
            routerLink="/tasks"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
            >Tasks</a
          >
        </li>
        <li>
          <a
            routerLink="/categories"
            routerLinkActive="active-link"
            (click)="closeMobileMenu()"
            >Categories</a
          >
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class NavbarComponent {
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
