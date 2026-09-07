import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Miga {
  etiqueta: string;
  href?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  @Input() titulo = '';
  @Input() intro = '';
  @Input() migas: Miga[] = [];
  @Input() conAccion = false;
}
