import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { UserRole } from '../../../store/models/auth.model';
import { AuthActions } from '../../../store/actions/auth.actions';
import { AppState } from '../../../store/app.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>
            <div class="title-container">
              <mat-icon color="primary">dynamic_form</mat-icon>
              <span>Dynamic Form Builder</span>
            </div>
          </mat-card-title>
          <mat-card-subtitle>Login to access the application</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput [(ngModel)]="username" name="username" required>
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <div>
              <label class="role-label">Select Role:</label>
              <mat-radio-group [(ngModel)]="selectedRole" name="role" class="role-radio-group">
                <mat-radio-button [value]="UserRole.ADMIN">Administrator</mat-radio-button>
                <mat-radio-button [value]="UserRole.USER">Standard User</mat-radio-button>
              </mat-radio-group>
            </div>

            <div class="form-info">
              <p><strong>Administrator:</strong> Can create, edit, and delete form templates</p>
              <p><strong>Standard User:</strong> Can only view and fill out forms</p>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions align="end">
          <button 
            mat-raised-button 
            color="primary" 
            (click)="onLogin()" 
            [disabled]="!username"
          >
            Login
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 64px);
    }
    
    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 24px;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      margin-top: 16px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .title-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .role-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.54);
    }
    
    .role-radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .form-info {
      margin-top: 16px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .form-info p {
      margin: 8px 0;
    }
  `]
})
export class LoginComponent {
  username = '';
  selectedRole = UserRole.USER;
  UserRole = UserRole;
  
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  onLogin(): void {
    if (this.username) {
      this.store.dispatch(AuthActions.login({ 
        username: this.username, 
        role: this.selectedRole 
      }));
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/forms';
      this.router.navigateByUrl(returnUrl);
    }
  }
} 