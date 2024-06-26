import { Component, NgModule, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { CommentsComponent } from '../comments/comments.component';
import { PostDjangoService } from '../../services/django/post-django.service';
import { UserDjangoService } from '../../services/django/user-django.service';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule,MatIconModule, MatMenuModule, MatButtonModule, CommonModule, CardComponent, CommentsComponent],
  providers: [PostDjangoService, UserDjangoService],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})

export class CardComponent implements OnInit {
  showComments: boolean = false;
  posts: any[] = []; // Definir un arreglo para almacenar los posts

  constructor(private postService: PostDjangoService, private userService: UserDjangoService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe(
      (data: any[]) => {
        this.posts = data; // Asignar los posts obtenidos del servicio al arreglo

        // Para cada post, obtener el nombre de usuario usando el user_id
        this.posts.forEach(post => {
          this.userService.getUserById(post.user_id).subscribe(
            (userData: any) => {
              post.username = userData.name; // Suponiendo que el servicio devuelve un objeto con el nombre del usuario
            },
            (error: any) => {
              console.error(`Error fetching user for post ${post.id}:`, error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
}
