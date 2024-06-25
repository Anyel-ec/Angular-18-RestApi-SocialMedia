import { Component } from '@angular/core';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { CardComponent } from '../../post/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
