import { Component } from '@angular/core';
import { UsersService } from '../../services/flask/users.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from '../../services/flask/session.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule ],
  providers: [UsersService],

})
export class LoginComponent {

  isSignUp: boolean = false;
  registerForm: FormGroup;

  constructor(
    private userService: UsersService,
    private sessionService: SessionService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100), this.validarNombreCompleto]),
      email: ['', [Validators.required, Validators.email, this.validarCorreoElectronico]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$'), Validators.minLength(10), Validators.maxLength(10)]],
      birthdate: ['', [Validators.required, this.minimumAgeValidator(16)]]

    });
  }

  private validarCorreoElectronico(control: AbstractControl): ValidationErrors | null {
    const correo = control.value;
    if (!correo) {
      return null;
    }

    const expresionRegular = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (expresionRegular.test(correo)) {
      return null;
    } else {
      return { correoInvalido: true };
    }
  }




  private validarNombreCompleto(control: AbstractControl): ValidationErrors | null {
    const nombre = control.value;
    if (!nombre) {
      return null;
    }

    if (nombre.length < 3) {
      return { nombreInvalido: true };
    }

    const expresionRegular = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\u00e1\u00e9\u00ed\u00f3\u00fa\u0020\u0027\u002E\u002D]*$/;
    if (expresionRegular.test(nombre)) {
      return null;
    } else {
      return { nombreInvalido: true };
    }
  }
  validateName(): void {
    const nameControl = this.registerForm.get('name');
    if (nameControl) {
      const value = nameControl.value;
      nameControl.setValue(value.replace(/[^a-zA-Z ]/g, ''), { emitEvent: false });
    }
  }

  validatePhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const birthdate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthdate.getFullYear();
      const monthDifference = today.getMonth() - birthdate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
        age--;
      }

      return age >= minAge ? null : { 'minimumAge': true };
    };
  }


  ngOnInit(): void {}

  showSignUp(): void {
    this.isSignUp = true;
  }

  showSignIn(): void {
    this.isSignUp = false;
  }

  login(event: Event, email: string, password: string): void {
    event.preventDefault();

    this.userService.login(email, password).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión correcto!',
          text: response.message,
        });
        this.userService.getUserByEmail(email).subscribe(
          userData => {
            this.sessionService.setUser(userData);
            this.router.navigate(['/inicio']);
          },
          error => {
            console.error('Error:', error);
          }
        );
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error de inicio de sesion',
          text: 'Por favor verifica tus credenciales.',
        });
        console.error('Error:', error);
      }
    );
  }

  onRegisterFormSubmit(event: Event): void {
    event.preventDefault();
    if (this.registerForm.valid) {
      const user = this.registerForm.value;

      this.userService.getVerifyExitsUser(user.email).subscribe(
        response => {
          // Si la respuesta es 200, el usuario ya existe
          if (response.message === 'User exists') {
            Swal.fire({
              icon: 'error',
              title: 'Error de registro',
              text: 'El correo electrónico ya está registrado.',
            });
          }
        },
        error => {
          // Si la respuesta es 404, el usuario no existe y se permite registrar
          if (error.status === 404) {
            this.userService.register(user).subscribe(
              response => {
                Swal.fire({
                  icon: 'success',
                  title: 'Registro exitoso!',
                  text: response.message,
                });
                this.showSignIn();
                this.registerForm.reset(); // limpia los campos del formulario
              },
              registrationError => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error de registro',
                  text: 'Por favor intenta de nuevo.',
                });
                console.error('Error:', registrationError);
              }
            );
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error de verificación',
              text: 'Hubo un error al verificar el correo electrónico. Por favor intenta de nuevo.',
            });
            console.error('Error:', error);
          }
        }
      );
    }
  }



}
