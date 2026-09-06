import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Icon } from '../icon/icon';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FormsModule, Icon],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  readonly navItems: NavItem[] = [
    { label: 'Inicio', icon: 'compass', path: '/dashboard' },
    { label: 'Conjuntos de datos', icon: 'layers', path: '/datasets' },
    { label: 'Organizaciones', icon: 'users', path: '/organizations' },
    { label: 'Configuración de perfil', icon: 'user', path: '/profile' },
  ];

  searchText = '';

  constructor(
    readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  search(): void {
    const q = this.searchText.trim();
    if (!q) {
      return;
    }
    void this.router.navigate(['/datasets'], { queryParams: { q } });
  }

  logout(): void {
    this.authService.logout();
  }
}
