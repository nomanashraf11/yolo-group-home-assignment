import { RouterModule } from '@angular/router';

import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="navbar-logo">
        <a routerLink="/" class="logo-link">
          <img
            src="/assets/icons/yolo.svg"
            alt="Logo"
            class="logo-img"
            style="width: 130px; height: 100px"
          />
        </a>
      </div>

      <ul class="nav-links">
        <li>
          <a
            routerLink="/tasks"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            >Tasks</a
          >
        </li>
        <li>
          <a routerLink="/categories" routerLinkActive="active-link"
            >Categories</a
          >
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class NavbarComponent {}
