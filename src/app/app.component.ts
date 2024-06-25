import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import { SessionService } from './services/shared/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserListComponent, HttpClientModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project_restapi';

  currentUser: any;

  constructor(private sessionService: SessionService, private router: Router) {
    this.currentUser = this.sessionService.getUser();
  }

  logout(): void {
    this.sessionService.clearUser();
    this.router.navigate(['/']); // Redirigir al componente de inicio de sesión
  }



}
