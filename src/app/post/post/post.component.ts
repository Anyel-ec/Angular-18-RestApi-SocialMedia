import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostDjangoService } from '../../services/django/post-django.service';
import Swal from 'sweetalert2';
import { SessionService } from '../../services/shared/session.service';
import { HttpClientModule } from '@angular/common/http';
import { CategoryDjangoService } from '../../services/django/category-django.service';
import { NewPostService } from '../../services/django/new-post.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [PostDjangoService, SessionService, CategoryDjangoService] // Provee el servicio de publicaciones
})

export class PostComponent implements OnInit {
  post = {
    title: '',
    content: '',
    user_id: 0,
    category_id: 0,
    image: undefined as File | undefined,
  };
  imagePreview: string | ArrayBuffer | null = null;
  currentUser: any;
  categories: any[] = [];

  constructor(
    private sessionService: SessionService,
    private categoryDjangoService: CategoryDjangoService,
    private postService: PostDjangoService,
    private newPostService: NewPostService // Inyectar el nuevo servicio

  ) {}

  ngOnInit(): void {
    this.currentUser = this.sessionService.getUser();
    if (this.currentUser) {
      this.post.user_id = this.currentUser.id; // Ajusta el ID del usuario según tu lógica de sesión
    }

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryDjangoService.getAllCategories().subscribe(
      categories => {
        this.categories = categories;
        // Establecer una categoría por defecto si es necesario
        if (this.categories.length > 0) {
          this.post.category_id = this.categories[0].id;
        }
      },
      error => {
        console.error('Error al cargar las categorías', error);
        Swal.fire('Error', 'Hubo un problema al cargar las categorías', 'error');
      }
    );
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      this.post.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }



  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    formData.append('user_id', this.post.user_id.toString());
    formData.append('category_id', this.post.category_id.toString());
    if (this.post.image) {
      formData.append('image', this.post.image);
    }

    this.postService.createPost(formData).subscribe(
      response => {
        console.log('Publicación creada exitosamente', response);
        Swal.fire('¡Éxito!', 'La publicación se creó correctamente', 'success');
        // Limpiar formulario después de éxito
        this.resetForm();
        this.newPostService.notifyPostCreated(); // Notificar que se ha creado una nueva publicación
      },
      error => {
        console.error('Error al crear la publicación', error);
        Swal.fire('Error', 'Hubo un problema al crear la publicación', 'error');
      }
    );
  }



  clearImagePreview(): void {
    this.imagePreview = null;
    this.post.image = undefined;
  }







  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.onFileSelected({ target: { files: [file] } } as unknown as Event);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }





  private resetForm(): void {
    this.post = { title: '', content: '', user_id: 0, category_id: 0, image: undefined };
    this.imagePreview = null;
  }

  onCancel(): void {
    this.resetForm();
  }
}
