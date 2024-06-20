import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../comment.service';
import { CommentSpringService } from '../../services/spring-boot/comment-spring.service';
import { Comment } from '../../models/comment.model';
import { CommentResponse } from '../../models/comment-response.model';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  providers: [CommentSpringService],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {

  comment: Comment = new Comment(null, null, null, '', '', []); // Inicializa un comentario vacío
  newResponse: string = '';

  constructor(private commentService: CommentSpringService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.comment.timeCreated = new Date().toISOString(); // Ajusta la fecha según tu implementación
    this.commentService.addComment(this.comment).subscribe(
      (response) => {
        console.log('Comentario agregado:', response);
        // Lógica adicional después de agregar el comentario principal
      },
      (error) => {
        console.error('Error al agregar el comentario:', error);
      }
    );
  }

  addResponse(): void {
    const response = new CommentResponse(null, this.comment.id, 1, this.newResponse, new Date().toISOString()); // Ajusta userId según tu lógica de autenticación

    this.commentService.addResponse(this.comment.id, response).subscribe(
      (response) => {
        console.log('Respuesta agregada:', response);
        // Lógica adicional después de agregar la respuesta
      },
      (error) => {
        console.error('Error al agregar la respuesta:', error);
      }
    );

    this.newResponse = ''; // Limpia el campo de nueva respuesta
  }
}
