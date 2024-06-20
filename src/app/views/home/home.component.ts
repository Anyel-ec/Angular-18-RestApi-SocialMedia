import { AfterViewInit, Component, OnInit } from '@angular/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NavComponent } from '../../layouts/nav/nav.component';
import { SessionService } from '../../services/flask/session.service';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../../services/flask/posts.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CategoriesService } from '../../services/categories/categories.service';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/flask/users.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InputTextareaModule, NavComponent, FormsModule, HttpClientModule, CommonModule],
  providers: [PostsService, CategoriesService, UsersService],
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

  constructor(
    private sessionService: SessionService,
    private postService: PostsService,
    private usersService: UsersService,
    private categoriesService: CategoriesService
  ) {}

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

  addComment(): void {
    if (this.newComment.trim()) {
      this.selectedPublication.comments.push(this.newComment.trim());
      this.newComment = '';
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  getUserName(userId: number): string {
    return this.userMap[userId] || 'Usuario desconocido';
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(
      response => {
        this.publications = response;
        this.publications.forEach(pub => {
          pub.comments = pub.comments || []; // Asegurar que comments esté inicializado como un arreglo vacío si no existe
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

}
