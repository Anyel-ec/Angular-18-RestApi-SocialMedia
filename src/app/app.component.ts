import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './layouts/nav/nav.component';
import { SessionService } from './services/flask/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserListComponent, HttpClientModule, LoginComponent, NavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project_restapi';

  currentUser: any;

  constructor(private sessionService: SessionService) {
    this.currentUser = this.sessionService.getUser();
  }

  logout(): void {
    this.sessionService.clearUser();
    // Redirigir al usuario al componente de inicio de sesión, por ejemplo
  }
}
