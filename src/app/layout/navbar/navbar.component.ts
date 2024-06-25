import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/shared/session.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [HttpClientModule, CommonModule],
  providers: [SessionService], // No es necesario proveer el servicio aquí si ya está en el módulo raíz
})
export class NavbarComponent implements OnInit {
  user: any;

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
    console.log('Usuario en navbar:', this.user);
  }

  clearSession(): void {
    this.sessionService.clearUser();
    console.log('Sesión eliminada');
    this.user = null;
    this.router.navigate(['/login']);
  }
}
