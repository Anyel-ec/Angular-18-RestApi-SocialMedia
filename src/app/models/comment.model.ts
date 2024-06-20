import { CommentResponse } from "./comment-response.model";

export class Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  timeCreated: string; // Ajusta el tipo según cómo manejes las fechas en Angular
  comment: CommentResponse[];

  constructor(id: number, postId: number, userId: number, content: string, timeCreated: string, comment: CommentResponse[]) {
    this.id = id;
    this.postId = postId;
    this.userId = userId;
    this.content = content;
    this.timeCreated = timeCreated;
    this.comment = comment;
  }
}
