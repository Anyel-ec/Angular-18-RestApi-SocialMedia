# **Select Language:** 🌍
- [Español (Spanish)](README-es.md)
- [English](README.md)

# Social Media Front-End Project

This project is a front-end implementation of a social media platform that interacts with microservices built using Flask and Spring Boot. The application allows users to register, log in, create posts, and comment on posts. The front-end is developed using Angular.


## RESULTS
### Login 
![Alt text](docs/login.png)
### Register 
![Alt text](docs/register.png)
### Validation 
![Alt text](docs/validation.png)
### Login 
![Alt text](docs/alert.png)


## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Project Structure](#project-structure)
- [Services](#services)
- [Components](#components)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication: Register, login, and session management.
- Post Management: Create, read, update, and delete posts.
- Comment Management: Add, edit, delete, and reply to comments.
- Categories: Fetch and display categories for posts.
- User Profiles: Fetch user details and manage user profiles.

## Technologies Used

- **Front-End:** Angular, TypeScript, HTML, CSS
- **Back-End Microservices:** Flask, Spring Boot
- **HTTP Client:** Angular HttpClient
- **UI Components:** PrimeNG, Bootstrap
- **Notifications:** SweetAlert2

## Setup and Installation

### Prerequisites

- Node.js and npm installed
- Angular CLI installed
- Back-end microservices running (Flask on port 5000, Spring Boot on port 8080)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Anyel-ec/Angular-18-RestApi-SocialMedia
    cd Angular-18-RestApi-SocialMedia
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the Angular application:

    ```bash
    ng serve
    ```

4. Access the application at `http://localhost:4200`.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.html
│   │   │   ├── login.component.scss
│   │   │   ├── login.component.ts
│   │   ├── home/
│   │   │   ├── home.component.html
│   │   │   ├── home.component.scss
│   │   │   ├── home.component.ts
│   │   ├── nav/
│   │   │   ├── nav.component.html
│   │   │   ├── nav.component.scss
│   │   │   ├── nav.component.ts
│   ├── services/
│   │   ├── flask/
│   │   │   ├── categories.service.ts
│   │   │   ├── comments.service.ts
│   │   │   ├── posts.service.ts
│   │   │   ├── users.service.ts
│   │   ├── spring-boot/
│   │   │   ├── comment-spring.service.ts
│   │   ├── shared/
│   │   │   ├── session.service.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.ts
│   ├── app.module.ts
├── assets/
├── environments/
│   ├── environment.prod.ts
│   ├── environment.ts
...

```

## Services

### CategoriesService

Handles operations related to categories.

```typescript
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://localhost:5000/api/categories';
  
  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
```

### CommentsService

Handles operations related to comments in Flask.

```typescript
@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'http://127.0.0.1:5000/api/getComment';

  constructor(private http: HttpClient) { }

  getComments(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
```

### PostsService

Handles operations related to posts.

```typescript
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = 'http://localhost:5000/api/posts';

  constructor(private http: HttpClient) { }

  createPost(postData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, postData);
  }

  getPosts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  deletePost(postId: number): Observable<any> {
    const url = `${this.apiUrl}/${postId}`;
    return this.http.delete<any>(url);
  }
  
  updatePost(postId: number, postData: any): Observable<any> {
    const url = `${this.apiUrl}/${postId}`;
    return this.http.put<any>(url, postData);
  }
}
```

### UsersService

Handles operations related to users.

```typescript
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  login(email: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}/verify`;
    const body = { email, password };
    return this.http.post<any>(loginUrl, body);
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  getUserByEmail(email: string): Observable<any> {
    const url = 'http://localhost:5000/api/user/data';
    const params = { email };
    return this.http.get<any>(url, { params });
  }

  getUserById(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<any>(url);
  }

  getVerifyExitsUser(email: string): Observable<any> {
    const url = 'http://localhost:5000/api/users/verify_exist';
    const body = { email };
    return this.http.post<any>(url, body);
  }
}
```

### CommentSpringService

Handles operations related to comments in Spring Boot.

```typescript
@Injectable({
  providedIn: 'root'
})
export class CommentSpringService {
  private apiUrl = 'http://localhost:8080/comment';

  constructor(private http: HttpClient) {}

  addResponse(commentId: number, response: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}/response`, response);
  }

  getCommentsByPostId(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/post/${postId}`);
  }

  addComment(comment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, comment);
  }

  addReplyToComment(id: number, reply: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reply`, reply);
  }

  updateComment(id: number, comment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/update`, comment);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/delete`);
  }
}
```

### SessionService

Manages user session data.

```typescript
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  setUser(user: any): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): any {
    if (typeof window !== 'undefined') {
      const user = sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  clearUser(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
    }
  }
}
```

## Components

### LoginComponent

Handles user login and registration.

```typescript
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [UsersService, UserDjangoService]
})
export class LoginComponent {
  // ...
}
```

### NavComponent

Handles navigation bar and user logout.

```typescript
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  providers: [SessionService],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  // ...
}
```

### HomeComponent

Main component for displaying posts and comments.

```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InputTextareaModule, NavComponent, FormsModule, HttpClientModule, CommonModule],
  providers: [PostsService, CategoriesService, UsersService, CommentSpringService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // ...
}
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more information.
