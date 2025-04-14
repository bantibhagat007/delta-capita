import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { AppState } from '../../../store/app.state';
import { FormActions } from '../../../store/actions/form.actions';
import { DynamicForm, FormField, FormSubmission } from '../../../store/models/form-field.model';

@Component({
  selector: 'app-submissions-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  template: `
    <div class="submissions-container">
      <div class="header">
        <h1>
          <ng-container *ngIf="form$ | async as form">
            Form Submissions: {{ form.title }}
          </ng-container>
        </h1>
        <button mat-button routerLink="/forms">
          <mat-icon>arrow_back</mat-icon>
          Back to Forms
        </button>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      
      <ng-container *ngIf="!loading">
        <ng-container *ngIf="submissions$ | async as submissions">
          <ng-container *ngIf="submissions.length > 0; else noSubmissions">
            <mat-card *ngFor="let submission of submissions; let i = index" class="submission-card">
              <mat-card-header>
                <mat-card-title>
                  Submission #{{ i + 1 }}
                </mat-card-title>
                <mat-card-subtitle>
                  Submitted: {{ submission.submittedAt | date:'medium' }}
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      View Submission Data
                    </mat-panel-title>
                    <mat-panel-description>
                      Click to expand
                    </mat-panel-description>
                  </mat-expansion-panel-header>
                  
                  <ng-container *ngIf="fields$ | async as fields">
                    <table class="submission-data-table">
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let field of fields">
                          <td>{{ field.label }}</td>
                          <td>
                            <ng-container *ngIf="submission.formData[field.id] !== undefined">
                              <ng-container *ngIf="isArray(submission.formData[field.id]); else notArray">
                                <ul class="value-list">
                                  <li *ngFor="let item of submission.formData[field.id]">
                                    {{ item }}
                                  </li>
                                </ul>
                              </ng-container>
                              <ng-template #notArray>
                                {{ formatValue(submission.formData[field.id], field) }}
                              </ng-template>
                            </ng-container>
                            <span *ngIf="submission.formData[field.id] === undefined" class="empty-value">
                              (Empty)
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </ng-container>
                </mat-expansion-panel>
              </mat-card-content>
            </mat-card>
          </ng-container>
          
          <ng-template #noSubmissions>
            <mat-card class="no-submissions-card">
              <mat-card-content>
                <div class="no-submissions-message">
                  <mat-icon>info</mat-icon>
                  <h2>No Submissions</h2>
                  <p>This form has not received any submissions yet.</p>
                </div>
              </mat-card-content>
            </mat-card>
          </ng-template>
        </ng-container>
      </ng-container>
    </div>
  `,
  styles: [`
    .submissions-container {
      padding: 16px;
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
    
    .submission-card {
      margin-bottom: 16px;
    }
    
    .submission-data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .submission-data-table th,
    .submission-data-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .submission-data-table th {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
    }
    
    .value-list {
      margin: 0;
      padding-left: 20px;
    }
    
    .empty-value {
      color: rgba(0, 0, 0, 0.38);
      font-style: italic;
    }
    
    .no-submissions-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 0;
      text-align: center;
    }
    
    .no-submissions-message mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.6);
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
export class SubmissionsListComponent implements OnInit {
  form$: Observable<DynamicForm | undefined>;
  submissions$: Observable<FormSubmission[]>;
  fields$: Observable<FormField[]>;
  formId: string | null = null;
  loading = true;
  
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.form$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      tap(id => {
        this.formId = id;
        this.store.dispatch(FormActions.loadForm({ id: id! }));
        this.store.dispatch(FormActions.loadSubmissions({ formId: id! }));
      }),
      switchMap(id => this.store.select(state => state.form.forms.entities[id!])),
      filter(form => !!form)
    );
    
    this.fields$ = this.form$.pipe(
      map(form => form ? [...form.fields].sort((a, b) => a.order - b.order) : [])
    );
    
    this.submissions$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter(id => !!id),
      switchMap(id => this.store.select(state => Object.values(state.form.submissions.entities)
        .filter(sub => sub && sub.formId === id) as FormSubmission[])
      )
    );
  }
  
  ngOnInit(): void {
    combineLatest([
      this.store.select(state => state.form.forms.loading),
      this.store.select(state => state.form.submissions.loading)
    ]).subscribe(([formsLoading, submissionsLoading]) => {
      this.loading = formsLoading || submissionsLoading;
    });
  }
  
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
  
  formatValue(value: any, field: FormField): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (field.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    return value.toString();
  }
} 