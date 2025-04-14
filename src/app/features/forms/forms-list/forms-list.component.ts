import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../services/auth.service';
import { AppState } from '../../../store/app.state';
import { FormActions } from '../../../store/actions/form.actions';
import { DynamicForm } from '../../../store/models/form-field.model';

@Component({
  selector: 'app-forms-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="forms-container">
      <div class="forms-header">
        <h1>Form Templates</h1>
        <div>
          <button 
            *ngIf="isAdmin" 
            mat-raised-button 
            color="primary" 
            (click)="createNewForm()"
          >
            <mat-icon>add</mat-icon>
            Create New Form
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading" class="forms-grid">
        <ng-container *ngIf="forms.length > 0; else noForms">
          <mat-card class="form-card" *ngFor="let form of forms">
            <mat-card-header>
              <mat-card-title>{{ form.title }}</mat-card-title>
              <mat-card-subtitle>
                Last updated: {{ form.updatedAt | date:'medium' }}
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p *ngIf="form.description">{{ form.description }}</p>
              <p>{{ form.fields.length }} fields</p>
            </mat-card-content>
            <mat-divider></mat-divider>
            <mat-card-actions>
              <button 
                mat-button 
                color="primary" 
                [routerLink]="['/forms', form.id, 'fill']"
              >
                <mat-icon>edit_note</mat-icon>
                Fill Form
              </button>
              <button 
                mat-button 
                color="accent" 
                [routerLink]="['/forms', form.id, 'view']"
              >
                <mat-icon>visibility</mat-icon>
                Preview
              </button>
              
              <div class="action-spacer"></div>
              
              <button 
                mat-icon-button 
                [matMenuTriggerFor]="menu" 
                aria-label="Form actions"
              >
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button 
                  mat-menu-item 
                  *ngIf="isAdmin" 
                  [routerLink]="['/forms', form.id, 'edit']"
                >
                  <mat-icon>edit</mat-icon>
                  <span>Edit Form</span>
                </button>
                <button 
                  mat-menu-item 
                  *ngIf="isAdmin" 
                  [routerLink]="['/forms', form.id, 'submissions']"
                >
                  <mat-icon>list_alt</mat-icon>
                  <span>View Submissions</span>
                </button>
                <button 
                  mat-menu-item 
                  *ngIf="isAdmin" 
                  (click)="deleteForm(form.id)"
                  class="delete-action"
                >
                  <mat-icon color="warn">delete</mat-icon>
                  <span>Delete Form</span>
                </button>
              </mat-menu>
            </mat-card-actions>
          </mat-card>
        </ng-container>
        
        <ng-template #noForms>
          <div class="no-forms-container">
            <mat-icon color="primary" class="no-forms-icon">description</mat-icon>
            <h2>No forms found</h2>
            <p>Get started by creating a new form template</p>
            <button 
              *ngIf="isAdmin"
              mat-raised-button 
              color="primary" 
              (click)="createNewForm()"
            >
              <mat-icon>add</mat-icon>
              Create New Form
            </button>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .forms-container {
      padding: 16px;
    }
    
    .forms-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .forms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .form-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .form-card mat-card-content {
      flex-grow: 1;
    }
    
    .action-spacer {
      flex: 1 1 auto;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
    
    .no-forms-container {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      background-color: #f9f9f9;
      border-radius: 8px;
      text-align: center;
    }
    
    .no-forms-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      margin-bottom: 16px;
    }
    
    .delete-action {
      color: #f44336;
    }
  `]
})
export class FormsListComponent implements OnInit {
  forms: DynamicForm[] = [];
  loading = true;
  isAdmin = false;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadForms();

    this.store.select(state => state.form.forms.entities).subscribe(entities => {
      if (entities) {
        this.forms = Object.values(entities).filter(form => form) as DynamicForm[];
        this.loading = false;
      }
    });

    this.store.select(state => state.form.forms.loading).subscribe(loading => {
      this.loading = loading;
    });
  }

  loadForms(): void {
    this.store.dispatch(FormActions.loadForms());
  }

  createNewForm(): void {
    this.router.navigate(['/forms/new']);
  }

  deleteForm(id: string): void {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      this.store.dispatch(FormActions.deleteForm({ id }));
    }
  }
} 