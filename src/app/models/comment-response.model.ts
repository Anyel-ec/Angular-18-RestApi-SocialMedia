export class CommentResponse {
  id: String;
  commentId: String;
  userId: number;
  content: string;
  timeCreated: string;

  constructor(id: String, commentId: String, userId: number, content: string, timeCreated: string) {
    this.id = id;
    this.commentId = commentId;
    this.userId = userId;
    this.content = content;
    this.timeCreated = timeCreated;
  }
}
