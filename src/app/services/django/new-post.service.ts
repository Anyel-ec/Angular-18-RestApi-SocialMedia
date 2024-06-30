import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewPostService {

  private postCreatedSource = new Subject<void>();
  postCreated$ = this.postCreatedSource.asObservable();

  notifyPostCreated() {
    this.postCreatedSource.next();
  }
}
