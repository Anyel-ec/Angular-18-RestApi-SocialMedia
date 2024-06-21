import { Injectable } from '@angular/core';

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
