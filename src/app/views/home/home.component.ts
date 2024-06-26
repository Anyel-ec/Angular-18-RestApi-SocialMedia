import { Component } from '@angular/core';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { CardComponent } from '../../post/card/card.component';
import { PostComponent } from '../../post/post/post.component';
import { CommentsComponent } from '../../post/comments/comments.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CardComponent, PostComponent, CommentsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
