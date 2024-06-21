import { AfterViewInit, Component, OnInit } from '@angular/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NavComponent } from '../../layouts/nav/nav.component';
import { SessionService } from '../../services/shared/session.service';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../../services/flask/posts.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/flask/users.service';
import { Modal } from 'bootstrap';
import { CategoriesService } from '../../services/flask/categories.service';
import { CommentSpringService } from '../../services/spring-boot/comment-spring.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InputTextareaModule, NavComponent, FormsModule, HttpClientModule, CommonModule],
  providers: [PostsService, CategoriesService, UsersService, CommentSpringService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  user: any;

  post = {
    title: '',
    content: '',
    category_id: null,
    usuario_id: null,
    time_created: ''
  };

  categories: any[] = [];
  publications: any[] = [];
  userMap: { [key: number]: string } = {};  // Mapa para almacenar los nombres de usuario
  selectedPublication: any = null;
  newComment: string = '';
  editingPublication: any = null;

  constructor(
    private sessionService: SessionService,
    private postService: PostsService,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private commentService: CommentSpringService
  ) {}


  // Método para cargar las publicaciones y categorías al iniciar el componente
  ngOnInit(): void {
    this.user = this.sessionService.getUser();
    this.post.usuario_id = this.user.id;

    this.categoriesService.getCategories().subscribe(
      response => {
        this.categories = response;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );

    this.loadPosts();
  }

  onPostSubmit(event: Event): void {
    event.preventDefault();
    this.post.time_created = new Date().toISOString();

    this.postService.createPost(this.post).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Post creado',
          text: 'Tu publicación ha sido creada exitosamente!',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
        this.post.title = '';
        this.post.content = '';
        this.post.category_id = null;
        this.loadPosts(); // Actualizar la lista de publicaciones después de crear una nueva
      },
      error => {
        console.error('Error creando post:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear tu publicación. Por favor, intenta nuevamente.',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
      }
    );
  }

  toggleLike(publication: any): void {
    publication.liked = !publication.liked;
    if (publication.liked) {
      publication.num_likes++;
    } else {
      publication.num_likes--;
    }
    // Aquí puedes llamar a un servicio para guardar el estado del like en el backend si es necesario.
  }

  openComments(publication: any): void {
    this.selectedPublication = publication;
    this.newComment = '';
  }

  toggleEditPublication(publication: any): void {
    if (this.editingPublication && this.editingPublication.id === publication.id) {
      this.editingPublication = null;
    } else {
      this.editingPublication = { ...publication };
    }
  }


  toggleComments(publication: any): void {
    if (this.selectedPublication === publication) {
      this.selectedPublication = null;
    } else {
      this.selectedPublication = publication;
      this.loadCommentsForPublication(publication);
    }
  }

  editPublication(publication: any): void {
    this.editingPublication = { ...publication };
  }

  deletePublication(publication: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(publication.id).subscribe(
          response => {
            console.log('Publicación eliminada', response);
            // Elimina la publicación de la lista local después de eliminarla del servidor
            this.publications = this.publications.filter(p => p.id !== publication.id);
            // Mostrar alerta de éxito
            Swal.fire({
              icon: 'success',
              title: 'Publicación eliminada',
              text: 'La publicación ha sido eliminada con éxito.',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error => {
            console.error('Error al eliminar la publicación', error);
            // Mostrar alerta de error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al eliminar la publicación.',
              showConfirmButton: false,
              timer: 1500
            });
          }
        );
      }
    });
  }

  addComment(): void {
    if (this.selectedPublication && this.newComment.trim()) {
      const comment = {
        id: null,
        postId: this.selectedPublication.id,
        userId: this.user.id,
        content: this.newComment.trim(),
        timeCreated: new Date().toISOString(),
        comment: []
      };

      this.commentService.addComment(comment).subscribe(
        response => {
          console.log('Comentario agregado:', response);
          this.selectedPublication.comments.push(response);
          this.newComment = '';
          Swal.fire({
            icon: 'success',
            title: 'Comentario agregado',
            text: 'Tu comentario ha sido agregado exitosamente.',
            showConfirmButton: false,
            timer: 1500,
            position: 'top-end',
            toast: true
          });
        },
        error => {
          console.error('Error al agregar comentario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al agregar tu comentario. Por favor, intenta nuevamente.',
            showConfirmButton: false,
            timer: 1500,
            position: 'top-end',
            toast: true
          });
        }
      );


    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  getUserName(userId: number): string {
    return this.userMap[userId] || 'Usuario desconocido';
  }

  loadCommentsForPublication(publication: any): void {
    this.commentService.getCommentsByPostId(publication.id).subscribe(
      response => {
        publication.comments = response;
      },
      error => {
        console.error(`Error fetching comments for post ${publication.id}:`, error);
      }
    );
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(
      response => {
        this.publications = response;
        this.publications.forEach(pub => {
          pub.comments = pub.comments || []; // Asegurar que comments esté inicializado como un arreglo vacío si no existe
          this.loadCommentsForPublication(pub); // Cargar comentarios para cada publicación
          this.usersService.getUserById(pub.usuario_id).subscribe(
            userResponse => {
              this.userMap[pub.usuario_id] = userResponse.name;
            },
            error => {
              console.error(`Error fetching user with id ${pub.usuario_id}:`, error);
            }
          );
        });
      },
      error => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  resetPostForm(): void {
    this.post = {
      title: '',
      content: '',
      category_id: null,
      usuario_id: this.user.id,
      time_created: ''
    };
  }

  loadUserName(userId: number): void {
    this.usersService.getUserById(userId).subscribe(
      userResponse => {
        this.userMap[userId] = userResponse.name;
      },
      error => {
        console.error(`Error fetching user with id ${userId}:`, error);
      }
    );
  }

  loadPublications(): void {
    this.postService.getPosts().subscribe(
      response => {
        this.publications = response;
        this.publications.forEach(pub => {
          pub.comments = pub.comments || [];
          this.loadUserName(pub.usuario_id);
        });
      },
      error => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  onEditSubmit(event: Event, publication: any): void {
    event.preventDefault();

    this.postService.updatePost(publication.id, publication).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Publicación actualizada',
          text: 'Los cambios se han guardado correctamente.',
          showConfirmButton: false,
          timer: 1500,
          position: 'top-end',
          toast: true
        });

        this.cancelEdit();
        this.loadPublications();
      },
      error => {
        console.error('Error al actualizar la publicación', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar los cambios. Por favor, intenta nuevamente.',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

  cancelEdit(): void {
    this.editingPublication = null;
  }


  toggleReply(comment: any): void {
    comment.showReplyBox = !comment.showReplyBox;
    comment.newReply = '';
  }

  addReply(comment: any): void {
    if (comment.newReply.trim()) {
      const reply = {
        id: null,
        commentId: comment.id,
        userId: this.user.id,
        content: comment.newReply.trim(),
        timeCreated: new Date().toISOString()
      };

      this.commentService.addReplyToComment(comment.id, reply).subscribe(
        response => {
          console.log('Respuesta agregada:', response);
          comment.comments.push(response);
          comment.newReply = '';
          comment.showReplyBox = false;
          Swal.fire({
            icon: 'success',
            title: 'Respuesta agregada',
            text: 'Tu respuesta ha sido agregada exitosamente.',
            showConfirmButton: false,
            timer: 1500,
            position: 'top-end',
            toast: true
          });
        },
        error => {
          console.error('Error al agregar respuesta:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al agregar tu respuesta. Por favor, intenta nuevamente.',
            showConfirmButton: false,
            timer: 1500,
            position: 'top-end',
            toast: true
          });
        }
      );
    }
  }


}
