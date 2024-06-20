export class CommentResponse {
  id: number;
  commentId: number;
  userId: number;
  content: string;
  timeCreated: string; // Ajusta el tipo según cómo manejes las fechas en Angular

  constructor(id: number, commentId: number, userId: number, content: string, timeCreated: string) {
    this.id = id;
    this.commentId = commentId;
    this.userId = userId;
    this.content = content;
    this.timeCreated = timeCreated;
  }
}
