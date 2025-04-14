import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppState } from '../../../store/app.state';
import { FormActions } from '../../../store/actions/form.actions';
import { DynamicForm } from '../../../store/models/form-field.model';
import { AuthService } from '../../../services/auth.service';
import { DynamicFormRendererComponent } from '../shared/dynamic-form-renderer/dynamic-form-renderer.component';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    DynamicFormRendererComponent
  ],
  template: `
    <div class="preview-container">
      <div class="header">
        <h1>Form Preview</h1>
        <div class="actions">
          <button mat-button routerLink="/forms">
            <mat-icon>arrow_back</mat-icon>
            Back to Forms
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            [routerLink]="['/forms', formId, 'fill']"
          >
            <mat-icon>edit_note</mat-icon>
            Fill Form
          </button>
          <button 
            mat-raised-button 
            *ngIf="isAdmin"
            color="accent" 
            [routerLink]="['/forms', formId, 'edit']"
          >
            <mat-icon>edit</mat-icon>
            Edit Form
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <mat-card *ngIf="form$ | async as form" class="form-card">
        <mat-card-header>
          <mat-card-title>{{ form.title }}</mat-card-title>
          <mat-card-subtitle *ngIf="form.description">{{ form.description }}</mat-card-subtitle>
        </mat-card-header>

        <mat-divider></mat-divider>

        <mat-card-content>
          <app-dynamic-form-renderer
            [form]="form"
            [readOnly]="true"
          ></app-dynamic-form-renderer>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .preview-container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    
    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px 0;
    }
    
    .form-card {
      margin-bottom: 24px;
    }
    
    mat-card-content {
      padding: 16px;
    }
    
    @media (max-width: 600px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
    }
  `]
})
export class FormPreviewComponent implements OnInit {
  form$: Observable<DynamicForm | undefined>;
  formId: string | null = null;
  loading = true;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.form$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      tap(id => {
        this.formId = id;
        this.store.dispatch(FormActions.loadForm({ id: id! }));
      }),
      switchMap(id => this.store.select(state => state.form.forms.entities[id!])),
      filter(form => !!form)
    );
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    this.store.select(state => state.form.forms.loading)
      .subscribe(loading => {
        this.loading = loading;
      });
  }
} 