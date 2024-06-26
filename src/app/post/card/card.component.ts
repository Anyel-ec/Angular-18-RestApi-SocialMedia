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
import { CategoryService } from '../../services/django/category-django.service';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule,MatIconModule, MatMenuModule, MatButtonModule, CommonModule, CardComponent, CommentsComponent],
  providers: [PostDjangoService, UserDjangoService, CategoryService],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})

export class CardComponent implements OnInit {
  showComments: boolean = false;
  posts: any[] = [];

  constructor(
    private postService: PostDjangoService,
    private userService: UserDjangoService,
    private categoryService: CategoryService // Inyecta el servicio de categoría
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe(
      (data: any[]) => {
        this.posts = data;
        this.posts.forEach(post => {
          this.userService.getUserById(post.user_id).subscribe(
            (userData: any) => {
              post.username = userData.name; // Asigna el nombre del usuario al post
            },
            (error: any) => {
              console.error(`Error fetching user for post ${post.id}:`, error);
            }
          );

          // Obtén la categoría por su ID y asigna el nombre de la categoría al post
          this.categoryService.getCategoryById(post.category_id).subscribe(
            (categoryData: any) => {
              post.category = categoryData.name; // Suponiendo que el servicio devuelve un objeto con el nombre de la categoría
            },
            (error: any) => {
              console.error(`Error fetching category for post ${post.id}:`, error);
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
