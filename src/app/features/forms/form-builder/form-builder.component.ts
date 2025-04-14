import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { AppState } from '../../../store/app.state';
import { FormActions } from '../../../store/actions/form.actions';
import { DynamicForm, FieldOption, FieldType, FormField } from '../../../store/models/form-field.model';
import { FieldPropertiesDialogComponent } from './field-properties-dialog/field-properties-dialog.component';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="form-builder-container">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Edit Form' : 'Create New Form' }}</h1>
        <div class="form-actions">
          <button mat-button (click)="cancel()">Cancel</button>
          <button mat-raised-button color="primary" (click)="saveForm()">Save Form</button>
        </div>
      </div>

      <div class="form-container">
        <form [formGroup]="formMetadataForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Form Title</mat-label>
            <input matInput formControlName="title" placeholder="Enter form title">
            <mat-error *ngIf="formMetadataForm.get('title')?.hasError('required')">
              Title is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" placeholder="Enter form description"></textarea>
          </mat-form-field>
        </form>

        <h2 class="section-header">Form Fields</h2>

        <div class="form-builder-toolbox">
          <h3>Add Fields</h3>
          <div>
            <button 
              mat-raised-button 
              color="primary" 
              class="toolbox-item" 
              (click)="addField(fieldTypes.TEXT)"
            >
              <mat-icon>text_fields</mat-icon>
              Text Input
            </button>
            <button 
              mat-raised-button 
              color="primary" 
              class="toolbox-item" 
              (click)="addField(fieldTypes.TEXTAREA)"
            >
              <mat-icon>notes</mat-icon>
              Text Area
            </button>
            <button 
              mat-raised-button 
              color="primary" 
              class="toolbox-item" 
              (click)="addField(fieldTypes.DROPDOWN)"
            >
              <mat-icon>arrow_drop_down_circle</mat-icon>
              Dropdown
            </button>
            <button 
              mat-raised-button 
              color="primary" 
              class="toolbox-item" 
              (click)="addField(fieldTypes.CHECKBOX_GROUP)"
            >
              <mat-icon>check_box</mat-icon>
              Checkbox Group
            </button>
            <button 
              mat-raised-button 
              color="primary" 
              class="toolbox-item" 
              (click)="addField(fieldTypes.DATE)"
            >
              <mat-icon>calendar_today</mat-icon>
              Date Picker
            </button>
            <button 
              mat-raised-button 
              color="primary" 
              class="toolbox-item" 
              (click)="addField(fieldTypes.RADIO_GROUP)"
            >
              <mat-icon>radio_button_checked</mat-icon>
              Radio Group
            </button>
          </div>
        </div>

        <div
          *ngIf="formFields.length === 0"
          class="empty-form-message"
        >
          <mat-icon>info</mat-icon>
          <p>Your form is empty. Add fields from the toolbox above.</p>
        </div>

        <div
          cdkDropList
          class="form-field-list"
          (cdkDropListDropped)="drop($event)"
          [cdkDropListData]="formFields"
        >
          <div
            *ngFor="let field of formFields; let i = index"
            cdkDrag
            class="form-field-container"
          >
            <div class="field-preview">
              <div class="field-header">
                <span class="field-handle" cdkDragHandle>
                  <mat-icon>drag_indicator</mat-icon>
                </span>
                <span class="field-type-badge">{{ getFieldTypeLabel(field.type) }}</span>
                <span class="field-title">{{ field.label || 'Untitled Field' }}</span>
                <span 
                  *ngIf="field.validation?.required" 
                  class="required-badge" 
                  matTooltip="Required field"
                >*</span>
                
                <div class="field-actions">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    matTooltip="Edit properties" 
                    (click)="editField(field)"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    matTooltip="Delete field" 
                    (click)="deleteField(field)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <div class="field-content">
                <ng-container [ngSwitch]="field.type">
                  
                  <ng-container *ngSwitchCase="fieldTypes.TEXT">
                    <mat-form-field appearance="outline" class="preview-field">
                      <mat-label>{{ field.label }}</mat-label>
                      <input matInput [placeholder]="field.placeholder || ''" disabled>
                      <mat-hint *ngIf="field.helpText">{{ field.helpText }}</mat-hint>
                    </mat-form-field>
                  </ng-container>

                  <ng-container *ngSwitchCase="fieldTypes.TEXTAREA">
                    <mat-form-field appearance="outline" class="preview-field">
                      <mat-label>{{ field.label }}</mat-label>
                      <textarea matInput [placeholder]="field.placeholder || ''" disabled></textarea>
                      <mat-hint *ngIf="field.helpText">{{ field.helpText }}</mat-hint>
                    </mat-form-field>
                  </ng-container>

                  <ng-container *ngSwitchCase="fieldTypes.DROPDOWN">
                    <mat-form-field appearance="outline" class="preview-field">
                      <mat-label>{{ field.label }}</mat-label>
                      <mat-select disabled>
                        <mat-option *ngFor="let option of field.options" [value]="option.value">
                          {{ option.label }}
                        </mat-option>
                      </mat-select>
                      <mat-hint *ngIf="field.helpText">{{ field.helpText }}</mat-hint>
                    </mat-form-field>
                  </ng-container>

                  <ng-container *ngSwitchCase="fieldTypes.CHECKBOX_GROUP">
                    <div class="checkbox-group-preview">
                      <div>{{ field.label }}</div>
                      <div *ngFor="let option of field.options" class="checkbox-option">
                        <mat-checkbox disabled>{{ option.label }}</mat-checkbox>
                      </div>
                      <div *ngIf="field.helpText" class="field-help-text">
                        {{ field.helpText }}
                      </div>
                    </div>
                  </ng-container>

                  <ng-container *ngSwitchCase="fieldTypes.DATE">
                    <mat-form-field appearance="outline" class="preview-field">
                      <mat-label>{{ field.label }}</mat-label>
                      <input matInput [matDatepicker]="picker" disabled>
                      <mat-hint *ngIf="field.helpText">{{ field.helpText }}</mat-hint>
                      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                      <mat-datepicker #picker disabled="true"></mat-datepicker>
                    </mat-form-field>
                  </ng-container>

                  <ng-container *ngSwitchCase="fieldTypes.RADIO_GROUP">
                    <div class="radio-group-preview">
                      <div>{{ field.label }}</div>
                      <mat-radio-group disabled class="radio-group">
                        <mat-radio-button 
                          *ngFor="let option of field.options" 
                          [value]="option.value" 
                          disabled
                        >
                          {{ option.label }}
                        </mat-radio-button>
                      </mat-radio-group>
                      <div *ngIf="field.helpText" class="field-help-text">
                        {{ field.helpText }}
                      </div>
                    </div>
                  </ng-container>
                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-builder-container {
      padding: 16px;
    }
    
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .preview-field {
      width: 100%;
    }
    
    .form-field-list {
      min-height: 100px;
    }
    
    .empty-form-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      border: 2px dashed #ccc;
      border-radius: 4px;
      margin: 1rem 0;
      background-color: #f9f9f9;
      text-align: center;
    }
    
    .empty-form-message mat-icon {
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
      margin-bottom: 0.5rem;
      color: #757575;
    }
    
    .field-preview {
      width: 100%;
    }
    
    .field-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .field-title {
      font-weight: 500;
      margin-right: 4px;
    }
    
    .field-actions {
      margin-left: auto;
    }
    
    .field-type-badge {
      background-color: #e0e0e0;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 12px;
      margin-right: 8px;
    }
    
    .required-badge {
      color: #f44336;
      font-weight: bold;
      margin-left: 4px;
    }
    
    .checkbox-group-preview,
    .radio-group-preview {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
    }
    
    .checkbox-option {
      margin: 6px 0;
    }
    
    .radio-group {
      display: flex;
      flex-direction: column;
      margin: 8px 0;
    }
    
    .field-help-text {
      font-size: 12px;
      color: rgba(0,0,0,0.54);
      margin-top: 4px;
    }
  `]
})
export class FormBuilderComponent implements OnInit {
  formMetadataForm: FormGroup;
  formFields: FormField[] = [];
  isEditMode = false;
  formId: string | null = null;
  loading = false;
  fieldTypes = FieldType;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formMetadataForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      take(1),
      map(params => params.get('id')),
      tap(id => {
        this.formId = id;
        this.isEditMode = !!id;
      }),
      filter(id => !!id),
      tap(() => this.loading = true),
      switchMap(id => {
        if (id) {
          this.store.dispatch(FormActions.loadForm({ id }));
          return this.store.select(state => state.form.forms.entities[id]);
        }
        return of(null);
      }),
      filter(form => !!form)
    ).subscribe(form => {
      if (form) {
        this.formMetadataForm.patchValue({
          title: form.title,
          description: form.description
        });
        this.formFields = [...form.fields].sort((a, b) => a.order - b.order);
      }
      this.loading = false;
    });
  }

  addField(type: FieldType): void {
    const defaultField: FormField = {
      id: uuidv4(),
      type,
      label: this.getDefaultLabel(type),
      validation: {},
      order: this.formFields.length
    };

    if (
      type === FieldType.DROPDOWN ||
      type === FieldType.CHECKBOX_GROUP ||
      type === FieldType.RADIO_GROUP
    ) {
      defaultField.options = [
        { id: uuidv4(), label: 'Option 1', value: 'option1' },
        { id: uuidv4(), label: 'Option 2', value: 'option2' }
      ];
    }

    this.formFields.push(defaultField);
    this.editField(defaultField);
  }

  editField(field: FormField): void {
    const dialogRef = this.dialog.open(FieldPropertiesDialogComponent, {
      width: '600px',
      data: { field: { ...field } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.formFields.findIndex(f => f.id === field.id);
        if (index !== -1) {
          this.formFields[index] = result;
        }
      }
    });
  }

  deleteField(field: FormField): void {
    const index = this.formFields.findIndex(f => f.id === field.id);
    if (index !== -1) {
      this.formFields.splice(index, 1);
      this.formFields.forEach((f, i) => f.order = i);
    }
  }

  drop(event: CdkDragDrop<FormField[]>): void {
    moveItemInArray(this.formFields, event.previousIndex, event.currentIndex);
    this.formFields.forEach((field, index) => {
      field.order = index;
    });
  }

  saveForm(): void {
    if (this.formMetadataForm.invalid) {
      this.formMetadataForm.markAllAsTouched();
      return;
    }

    if (this.formFields.length === 0) {
      this.snackBar.open('Please add at least one field to your form', 'Close', {
        duration: 3000
      });
      return;
    }

    const formData: DynamicForm = {
      id: this.formId || uuidv4(),
      title: this.formMetadataForm.value.title,
      description: this.formMetadataForm.value.description,
      fields: [...this.formFields],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.isEditMode) {
      this.store.dispatch(FormActions.updateForm({ form: formData }));
    } else {
      this.store.dispatch(FormActions.createForm({ form: formData }));
    }

    this.router.navigate(['/forms']);
  }

  cancel(): void {
    this.router.navigate(['/forms']);
  }

  getFieldTypeLabel(type: FieldType): string {
    switch (type) {
      case FieldType.TEXT:
        return 'Text';
      case FieldType.TEXTAREA:
        return 'Text Area';
      case FieldType.DROPDOWN:
        return 'Dropdown';
      case FieldType.CHECKBOX_GROUP:
        return 'Checkbox Group';
      case FieldType.DATE:
        return 'Date';
      case FieldType.RADIO_GROUP:
        return 'Radio Group';
      default:
        return 'Unknown';
    }
  }

  private getDefaultLabel(type: FieldType): string {
    switch (type) {
      case FieldType.TEXT:
        return 'Text Field';
      case FieldType.TEXTAREA:
        return 'Text Area';
      case FieldType.DROPDOWN:
        return 'Dropdown';
      case FieldType.CHECKBOX_GROUP:
        return 'Checkbox Group';
      case FieldType.DATE:
        return 'Date';
      case FieldType.RADIO_GROUP:
        return 'Radio Group';
      default:
        return 'New Field';
    }
  }
} 