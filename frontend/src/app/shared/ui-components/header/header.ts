import { RouterModule } from '@angular/router';

import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="navbar-logo">
        <a routerLink="/" class="logo-link">
          <img src="assets/logo.svg" alt="Logo" class="logo-img" />
          <span class="logo-text">Task Manager</span>
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

      <div class="navbar-actions">
        <button class="btn btn-primary">+ New Task</button>
      </div>
    </nav>
  `,
  styleUrls: ['./header.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class NavbarComponent {}
