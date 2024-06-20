import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [UsersService]
})
export class LoginComponent {

  isSignUp: boolean = false;

  constructor(
    private userService: UsersService,
    private sessionService: SessionService,
    private router: Router
  ) { }
  ngOnInit(): void {
  }

  showSignUp(): void {
    this.isSignUp = true;
  }

  showSignIn(): void {
    this.isSignUp = false;
  }

  login(event: Event, email: string, password: string): void {
    event.preventDefault(); // Evitar que el formulario se envíe y la página se recargue
    this.userService.login(email, password).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Login successful!',
          text: response.message,
        });
        // Aquí podrías redirigir a otra página o realizar otras acciones según tu aplicación
        // Obtener los datos completos del usuario
        this.userService.getUserByEmail(email).subscribe(
          userData => {
            console.log('User Data:', userData);
            this.sessionService.setUser(userData); // Guardar datos en la sesión
            this.router.navigate(['/inicio']); // Redirigir a la página de inicio
          },
          error => {
            console.error('Error:', error); // Manejo de errores según sea necesario
          }
        );
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: 'Please check your credentials.',
        });
        console.error('Error:', error); // También puedes manejar el error de otra forma según tu necesidad
      }
    );
  }

  onRegisterFormSubmit(name: string, email: string, password: string, phone: string, birthdate: string, event: Event): void {
    event.preventDefault();
    const user = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      birthdate: birthdate,
      salt: ''
    };

    this.userService.register(user).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: response.message,
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Registration failed',
          text: 'An error occurred while registering the user.',
        });
        console.error('Error:', error);
      }
    );
  }


}
