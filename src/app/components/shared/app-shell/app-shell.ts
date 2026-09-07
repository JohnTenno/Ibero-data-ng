import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Icon } from '../icon/icon';
import { CampoBusqueda } from '../campo-busqueda/campo-busqueda';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Icon, CampoBusqueda],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  readonly navItems: NavItem[] = [
    { label: 'Inicio', icon: 'pictograma-explorar', path: '/dashboard' },
    { label: 'Conjuntos de datos', icon: 'pictograma-capas', path: '/datasets' },
    { label: 'Organizaciones', icon: 'pictograma-grupo', path: '/organizations' },
    { label: 'Configuración de perfil', icon: 'pictograma-persona', path: '/profile' },
  ];

  filtrados: NavItem[] = [...this.navItems];

  constructor(readonly authService: AuthService) {}

  alFiltrarMenu(items: object[]): void {
    this.filtrados = items as NavItem[];
  }

  logout(): void {
    this.authService.logout();
  }
}
