import { Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { CommentsComponent } from '../comments/comments.component';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule,MatIconModule, MatMenuModule, MatButtonModule, CommonModule, CardComponent, CommentsComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})

export class CardComponent {
  showComments: boolean = false;

  constructor() {}

  toggleComments() {
    this.showComments = !this.showComments;
  }
}
