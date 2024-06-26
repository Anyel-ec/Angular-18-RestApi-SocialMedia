import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})

export class PostComponent {
  post = {
    title: '',
    description: ''
  };
  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
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

  clearImagePreview(): void {
    this.imagePreview = null;
  }

  onSubmit(): void {
    // Lógica para enviar el formulario
    console.log('Formulario enviado', this.post);
  }

  onCancel(): void {
    this.post = { title: '', description: '' };
    this.imagePreview = null;
  }
}
