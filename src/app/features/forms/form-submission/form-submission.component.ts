import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, finalize } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppState } from '../../../store/app.state';
import { FormActions } from '../../../store/actions/form.actions';
import { DynamicForm } from '../../../store/models/form-field.model';
import { DynamicFormRendererComponent } from '../shared/dynamic-form-renderer/dynamic-form-renderer.component';

@Component({
  selector: 'app-form-submission',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DynamicFormRendererComponent
  ],
  template: `
    <div class="submission-container">
      <div class="header">
        <h1>Form Submission</h1>
        <button mat-button routerLink="/forms">
          <mat-icon>arrow_back</mat-icon>
          Back to Forms
        </button>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      
      <ng-container *ngIf="form$ | async as form">
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>{{ form.title }}</mat-card-title>
            <mat-card-subtitle *ngIf="form.description">
              {{ form.description }}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-divider></mat-divider>
          
          <mat-card-content>
            <app-dynamic-form-renderer
              [form]="form"
              [submitting]="submitting"
              (formSubmit)="onFormSubmit($event, form.id)"
            ></app-dynamic-form-renderer>
          </mat-card-content>
        </mat-card>
      </ng-container>
      
      <div *ngIf="submitted" class="submission-success">
        <mat-card>
          <mat-card-content>
            <div class="success-message">
              <mat-icon color="primary">check_circle</mat-icon>
              <h2>Form Submitted Successfully!</h2>
              <p>Thank you for your submission.</p>
            </div>
            
            <div class="success-actions">
              <button mat-button routerLink="/forms">
                Return to forms list
              </button>
              <button mat-raised-button color="primary" (click)="resetForm()">
                Submit another response
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .submission-container {
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
    
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px 0;
    }
    
    .form-card {
      margin-bottom: 24px;
      display: block;
    }
    
    .submission-success {
      margin-top: 24px;
    }
    
    .success-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 16px 0;
    }
    
    .success-message mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
    
    .success-message h2 {
      margin-bottom: 8px;
    }
    
    .success-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }
    
    @media (max-width: 600px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .success-actions {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class FormSubmissionComponent implements OnInit {
  form$: Observable<DynamicForm | undefined>;
  formId: string | null = null;
  loading = true;
  submitting = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
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
    this.store.select(state => state.form.forms.loading)
      .subscribe(loading => {
        this.loading = loading;
      });
  }

  onFormSubmit(formData: Record<string, any>, formId: string): void {
    this.submitting = true;

    this.store.dispatch(FormActions.submitForm({
      formId,
      formData
    }));

    this.store.select(state => state.form.submissions.loading)
      .pipe(
        filter(loading => !loading),
        take(1),
        finalize(() => this.submitting = false)
      )
      .subscribe(() => {
        this.store.select(state => state.form.submissions.error)
          .pipe(take(1))
          .subscribe(error => {
            if (error) {
              this.snackBar.open('Error submitting form: ' + error, 'Close', {
                duration: 5000
              });
            } else {
              this.submitted = true;
            }
          });
      });
  }

  resetForm(): void {
    this.submitted = false;
    window.location.reload();
  }
} 