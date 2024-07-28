import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from '../comments/comments.component';
import { PostDjangoService } from '../../services/django/post-django.service';
import { UserDjangoService } from '../../services/django/user-django.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoryDjangoService } from '../../services/django/category-django.service';
import { NewPostService } from '../../services/django/new-post.service';
import Swal from 'sweetalert2';
import { SessionService } from '../../services/shared/session.service';
import { CommentSpringService } from '../../services/spring-boot/comment-spring.service';
import { LikeSpringService, Like } from '../../services/spring-boot/like-spring.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatMenuModule, MatButtonModule, CommonModule, CommentsComponent, FormsModule],
  providers: [CommentSpringService, PostDjangoService, UserDjangoService,SessionService, CategoryDjangoService, LikeSpringService],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  showComments: boolean = false;
  posts: any[] = [];
  expandedPostId: number | null = null;
  editingPost: any = null;
  categories: any[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  currentUser: any;

  constructor(
    private postService: PostDjangoService,
    private userService: UserDjangoService,
    private sanitizer: DomSanitizer,
    private categoryDjangoService: CategoryDjangoService,
    private newPostService: NewPostService,
    private commentService: CommentSpringService,
    private likeService: LikeSpringService,
    private sessionService: SessionService // Inyectar el servicio de sesión
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadCategories();
    this.newPostService.postCreated$.subscribe(() => {
      this.loadPosts();
    });
    this.currentUser = this.sessionService.getUser(); // Obtener el usuario actual al inicializar el componente
  }

  toggleComments(postId: number) {
    this.showComments = !this.showComments;
    this.expandedPostId = this.showComments ? postId : null;
  }

  loadCategories(): void {
    this.categoryDjangoService.getAllCategories().subscribe(
      (categories: any[]) => {
        this.categories = categories;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }


  expandImage(post: any) {
    post.isImageExpanded = true;
  }

  closeImage(post: any) {
    post.isImageExpanded = false;
  }



  startEdit(post: any) {
    this.editingPost = { ...post };
    this.imagePreview = post.image ? this.getImageUrl(post.image) : null;
    // Asignar el user_id del usuario actual al editar
    this.editingPost.user_id = this.currentUser.id;
  }

  cancelEdit() {
    this.editingPost = null;
    this.imagePreview = null;
  }

  confirmDelete(postId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede revertir. ¿Quieres eliminar esta publicación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletePost(postId);
      }
    });
  }

  deletePost(postId: number) {
    Swal.fire({
      icon: 'success',
      title: 'La publicación ha sido eliminada.',
      position: 'top-end',
      toast: true,
      timer: 1500,
      showConfirmButton: false
    });

    this.postService.deletePost(postId).subscribe(
      () => {
        this.loadPosts();
      },
      (error: any) => {
        console.error(`Error deleting post ${postId}:`, error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al eliminar la publicación.',
        });
      }
    );
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe(
      (data: any[]) => {
        this.posts = data.map(post => ({
          ...post,
          isImageExpanded: false,
          userLiked: false,
          likeCount: 0
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

          this.commentService.countCommentsByPostId(post.id).subscribe(
            (count: number) => {
              post.commentCount = count;
              console.log(`Número de comentarios para el post ${post.id}:`, count);
            },
            (error: any) => {
              console.error(`Error fetching comment count for post ${post.id}:`, error);
            }
          );

          this.likeService.countLikesByPostId(post.id).subscribe(
            (count: number) => {
              post.likeCount = count;
              console.log(`Número de likes para el post ${post.id}:`, count);
            },
            (error: any) => {
              console.error(`Error fetching like count for post ${post.id}:`, error);
            }
          );

          this.likeService.getLikesByPostId(post.id).subscribe(
            (likes: Like[]) => {
              const userLike = likes.find(like => like.userId === this.currentUser.id);
              post.userLiked = !!userLike;
            },
            (error: any) => {
              console.error(`Error fetching likes for post ${post.id}:`, error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  toggleLike(post: any) {
    const userLike = post.userLiked;
    this.likeService.addOrUpdateLike(post.id, this.currentUser.id, !userLike).subscribe(
      (like: Like) => {
        post.userLiked = !userLike;
        post.likeCount += post.userLiked ? 1 : -1;
      },
      (error: any) => {
        console.error(`Error toggling like for post ${post.id}:`, error);
      }
    );
  }


  getImageUrl(imagePath: string): any {
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8000' + imagePath);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      this.editingPost.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  savePost(): void {
    const formData = new FormData();
    formData.append('title', this.editingPost.title);
    formData.append('content', this.editingPost.content);
    formData.append('category_id', this.editingPost.category_id.toString());

    // Solo agregar la imagen si se ha seleccionado una nueva
    if (this.editingPost.image && this.editingPost.image instanceof File) {
      formData.append('image', this.editingPost.image);
    } else {
      // Si no se selecciona una nueva imagen, mantener la anterior
      formData.append('existing_image', this.editingPost.image);
    }

    formData.append('user_id', this.currentUser.id);

    this.postService.updatePost(this.editingPost.id, formData).subscribe(
      response => {
        console.log('Publicación actualizada exitosamente', response);
        Swal.fire('¡Éxito!', 'La publicación se actualizó correctamente', 'success');
        this.cancelEdit();
        this.loadPosts();
      },
      error => {
        console.error('Error al actualizar la publicación', error);
        Swal.fire('Error', 'Hubo un problema al actualizar la publicación', 'error');
      }
    );
  }




}

