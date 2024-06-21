import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { SessionService } from '../../services/shared/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  providers: [SessionService],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  constructor(private sessionService: SessionService, private router: Router) {}


  onLogout(): void {
    // Mostrar la alerta de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, cerrar sesión
        this.sessionService.clearUser();

        // Mostrar la alerta de sesión cerrada
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/']); // Redirigir al componente raíz
        });
      }
    });
  }
}
