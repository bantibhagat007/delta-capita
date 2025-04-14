import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { AuthActions } from './store/actions/auth.actions';
import { AppState } from './store/app.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" *ngIf="isLoggedIn">
        <span>Dynamic Form Builder</span>
        <span class="spacer"></span>
        <span class="user-info" *ngIf="username">
          {{ username }} ({{ isAdmin ? 'Admin' : 'User' }})
        </span>
        <button mat-icon-button (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>
      
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    main {
      flex: 1;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-info {
      margin-right: 16px;
      font-size: 14px;
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  username = '';
  
  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {}
  
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.store.dispatch(AuthActions.loginSuccess({ user }));
      this.isLoggedIn = true;
      this.isAdmin = this.authService.isAdmin();
      this.username = user.username;
    }
    
    this.store.select(state => state.auth.user).subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = this.authService.isAdmin();
      this.username = user?.username || '';
    });
  }
  
  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
