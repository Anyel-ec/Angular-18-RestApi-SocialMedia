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
import { DomSanitizer } from '@angular/platform-browser';
import { CategoryDjangoService } from '../../services/django/category-django.service';
import { NewPostService } from '../../services/django/new-post.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule,MatIconModule, MatMenuModule, MatButtonModule, CommonModule, CardComponent, CommentsComponent],
  providers: [PostDjangoService, UserDjangoService, CategoryDjangoService],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})

export class CardComponent implements OnInit {
  showComments: boolean = false;
  posts: any[] = [];

  constructor(
    private postService: PostDjangoService,
    private userService: UserDjangoService,
    private sanitizer: DomSanitizer, // Inyecta DomSanitizer
    private categoryDjangoService: CategoryDjangoService, // Inyecta el servicio de categoría
    private newPostService: NewPostService // Inyectar el nuevo servicio

  ) { }

  ngOnInit(): void {
    this.loadPosts();
    this.newPostService.postCreated$.subscribe(() => {
      this.loadPosts(); // Cargar publicaciones cuando se notifique un nuevo post
    });
  }
  isImageExpanded = false;
  expandedImageIndex: number | null = null; // Variable para controlar la imagen expandida

  expandImage(post: any) {
    post.isImageExpanded = true;
  }

  closeImage(post: any) {
    post.isImageExpanded = false;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe(
      (data: any[]) => {
        this.posts = data.map(post => ({
          ...post,
          isImageExpanded: false // Agregar propiedad para controlar la expansión de la imagen
        })).reverse();

        this.posts.forEach(post => {
          this.userService.getUserById(post.user_id).subscribe(
            (userData: any) => {
              post.username = userData.name;
            },
            (error: any) => {
              console.error(`Error fetching user for post ${post.id}:`, error);
            }
          );

          this.categoryDjangoService.getCategoryById(post.category_id).subscribe(
            (categoryData: any) => {
              post.category = categoryData.name;
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

  getImageUrl(imagePath: string): any {
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8000' + imagePath);
  }

}
