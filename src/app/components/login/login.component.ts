import { Component } from '@angular/core';
import { UsersService } from '../../services/flask/users.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from '../../services/shared/session.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserDjangoService } from '../../services/django/user-django.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule ],
  providers: [UsersService, UserDjangoService],

})
export class LoginComponent {
  isSignUp: boolean = false;
  registerForm: FormGroup;
  genders: any[] = [];
  provinces: any[] = [];
  showPassword: boolean = false;
  showLoginPassword: boolean = false;

  constructor(
    private sessionService: SessionService,
    private userDjangoService: UserDjangoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100), this.validarNombreCompleto]),
      email: ['', [Validators.required, Validators.email, this.validarCorreoElectronico]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$'), Validators.minLength(10), Validators.maxLength(10)]],
      birthdate: ['', [Validators.required, this.minimumAgeValidator(16)]],
      province: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      status: [2] // Hidden field with default value 2
    });
  }

  ngOnInit(): void {
    this.loadGenders();
    this.loadProvinces();
  }

  private loadGenders(): void {
    this.userDjangoService.getAllGenders().subscribe(
      data => this.genders = data,
      error => console.error('Error loading genders:', error)
    );
  }

  private loadProvinces(): void {
    this.userDjangoService.getAllProvinces().subscribe(
      data => this.provinces = data,
      error => console.error('Error loading provinces:', error)
    );
  }

  private validarCorreoElectronico(control: AbstractControl): ValidationErrors | null {
    const correo = control.value;
    if (!correo) {
      return null;
    }
    const expresionRegular = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return expresionRegular.test(correo) ? null : { correoInvalido: true };
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
    return expresionRegular.test(nombre) ? null : { nombreInvalido: true };
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

  showSignUp(): void {
    this.isSignUp = true;
  }

  showSignIn(): void {
    this.isSignUp = false;
  }

  login(event: Event, email: string, password: string): void {
    event.preventDefault();
    this.userDjangoService.login(email, password).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión correcto!',
          text: response.message,
        });
        this.userDjangoService.getUserByEmail(email).subscribe(
          userData => {
            this.sessionService.setUser(userData);
            this.router.navigate(['/inicio']);
          },
          error => console.error('Error obteniendo usuario:', error)
        );
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error de inicio de sesión',
          text: 'Por favor verifica tus credenciales.',
        });
        console.error('Error de inicio de sesión:', error);
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }
  onRegisterFormSubmit(event: Event): void {
    event.preventDefault();
    if (this.registerForm.valid) {
      const user = this.registerForm.value;
      this.userDjangoService.getVerifyExitsUser(user.email).subscribe(
        response => {
          if (response.message === 'Usuario existe') {
            Swal.fire({
              icon: 'error',
              title: 'Error de registro',
              text: 'El correo electrónico ya está registrado.',
            });
          }
        },
        error => {
          if (error.status === 404) {
            this.userDjangoService.createUser(user).subscribe(
              response => {
                Swal.fire({
                  icon: 'success',
                  title: 'Registro exitoso!',
                  text: response.message,
                });
                this.showSignIn();
                this.registerForm.reset();
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
