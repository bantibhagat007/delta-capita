import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { DynamicForm, FieldType, FormField } from '../../../../store/models/form-field.model';

@Component({
  selector: 'app-dynamic-form-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ],
  template: `
    <div class="dynamic-form-container">
      <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
        <ng-container *ngFor="let field of formFields">
          <div class="form-field-wrapper">
            <ng-container [ngSwitch]="field.type">
              <ng-container *ngSwitchCase="fieldTypes.TEXT">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ field.label }}</mat-label>
                  <input 
                    matInput 
                    [formControlName]="field.id" 
                    [placeholder]="field.placeholder || ''"
                    [readonly]="readOnly"
                  >
                  <mat-hint *ngIf="field.helpText">{{ field.helpText }}</mat-hint>
                  <mat-error *ngIf="hasError(field)">
                    {{ getErrorMessage(field) }}
                  </mat-error>
                </mat-form-field>
              </ng-container>
              
              <ng-container *ngSwitchCase="fieldTypes.TEXTAREA">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ field.label }}</mat-label>
                  <textarea 
                    matInput 
                    [formControlName]="field.id" 
                    [placeholder]="field.placeholder || ''"
                    [readonly]="readOnly"
                    rows="4"
                  ></textarea>
                  <mat-hint *ngIf="field.helpText">{{ field.helpText }}</mat-hint>
                  <mat-error *ngIf="hasError(field)">
                    {{ getErrorMessage(field) }}
                  </mat-error>
                </mat-form-field>
              </ng-container>
              
              <ng-container *ngSwitchCase="fieldTypes.DROPDOWN">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ field.label }}</mat-label>
                  <mat-select 
                    [formControlName]="field.id"
                    [disabled]="readOnly"
                  >
                    <mat-option *ngFor="let option of field.options" [value]="option.value">
                      {{ option.label }}
                    </mat-option>
                  </mat-select>
                  <mat-hint *ngIf="field.helpText">{{ field.helpText }}</mat-hint>
                  <mat-error *ngIf="hasError(field)">
                    {{ getErrorMessage(field) }}
                  </mat-error>
                </mat-form-field>
              </ng-container>
              
              <ng-container *ngSwitchCase="fieldTypes.CHECKBOX_GROUP">
                <div class="field-label">{{ field.label }}</div>
                <div class="checkbox-group" [formGroupName]="field.id">
                  <div *ngFor="let option of field.options" class="checkbox-item">
                    <mat-checkbox 
                      [formControlName]="option.id"
                      [disabled]="readOnly"
                    >
                      {{ option.label }}
                    </mat-checkbox>
                  </div>
                </div>
                <div *ngIf="field.helpText" class="field-hint">{{ field.helpText }}</div>
              </ng-container>
              
              <ng-container *ngSwitchCase="fieldTypes.DATE">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ field.label }}</mat-label>
                  <input 
                    matInput 
                    [matDatepicker]="picker"
                    [formControlName]="field.id"
                    [readonly]="readOnly"
                  >
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker [disabled]="readOnly"></mat-datepicker>
                  <mat-hint *ngIf="field.helpText">{{ field.helpText }}</mat-hint>
                  <mat-error *ngIf="hasError(field)">
                    {{ getErrorMessage(field) }}
                  </mat-error>
                </mat-form-field>
              </ng-container>
              
              <ng-container *ngSwitchCase="fieldTypes.RADIO_GROUP">
                <div class="field-label">{{ field.label }}</div>
                <mat-radio-group 
                  [formControlName]="field.id"
                  class="radio-group"
                  [disabled]="readOnly"
                >
                  <mat-radio-button 
                    *ngFor="let option of field.options" 
                    [value]="option.value"
                  >
                    {{ option.label }}
                  </mat-radio-button>
                </mat-radio-group>
                <div *ngIf="field.helpText" class="field-hint">{{ field.helpText }}</div>
                <div *ngIf="hasError(field)" class="field-error">
                  {{ getErrorMessage(field) }}
                </div>
              </ng-container>
            </ng-container>
          </div>
        </ng-container>
        
        <div class="form-actions" *ngIf="!readOnly">
          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            [disabled]="formGroup.invalid || submitting"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dynamic-form-container {
      padding: 16px 0;
    }
    
    .form-field-wrapper {
      margin-bottom: 20px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .field-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.6);
    }
    
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .field-hint {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.54);
      margin-top: 4px;
    }
    
    .field-error {
      font-size: 12px;
      color: #f44336;
      margin-top: 4px;
    }
    
    .form-actions {
      margin-top: 32px;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class DynamicFormRendererComponent implements OnInit, OnChanges {
  @Input() form!: DynamicForm;
  @Input() readOnly = false;
  @Input() submitting = false;

  @Output() formSubmit = new EventEmitter<Record<string, any>>();

  formGroup!: FormGroup;
  formFields: FormField[] = [];
  fieldTypes = FieldType;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form'] && !changes['form'].firstChange) {
      this.initForm();
    }
  }

  initForm(): void {
    if (!this.form) return;
    this.formFields = [...this.form.fields].sort((a, b) => a.order - b.order);
    const formControls: Record<string, any> = {};

    this.formFields.forEach(field => {
      if (field.type === FieldType.CHECKBOX_GROUP) {
        const checkboxGroup: Record<string, any> = {};

        field.options?.forEach(option => {
          checkboxGroup[option.id] = [false];
        });

        formControls[field.id] = this.fb.group(checkboxGroup);
      } else {
        const validators = this.buildValidators(field);
        formControls[field.id] = ['', validators];
      }
    });

    this.formGroup = this.fb.group(formControls);
    if (this.readOnly) {
      this.formGroup.disable();
    }
  }

  buildValidators(field: FormField): any[] {
    const validators = [];

    if (field.validation?.required) {
      validators.push(Validators.required);
    }

    if (field.validation?.minLength !== undefined && field.validation.minLength >= 0) {
      validators.push(Validators.minLength(field.validation.minLength));
    }

    if (field.validation?.maxLength !== undefined && field.validation.maxLength >= 0) {
      validators.push(Validators.maxLength(field.validation.maxLength));
    }

    if (field.validation?.pattern) {
      validators.push(Validators.pattern(field.validation.pattern));
    }

    if (field.validation?.min !== undefined) {
      validators.push(Validators.min(field.validation.min));
    }

    if (field.validation?.max !== undefined) {
      validators.push(Validators.max(field.validation.max));
    }

    return validators;
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.markFormGroupTouched(this.formGroup);
      return;
    }
    const formData = this.normalizeFormData();
    this.formSubmit.emit(formData);
  }

  normalizeFormData(): Record<string, any> {
    const result: Record<string, any> = {};

    this.formFields.forEach(field => {
      if (field.type === FieldType.CHECKBOX_GROUP) {
        const checkboxGroup = this.formGroup.get(field.id)?.value;
        const selectedOptions = [];

        if (checkboxGroup) {
          for (const [optionId, isSelected] of Object.entries(checkboxGroup)) {
            if (isSelected) {
              const option = field.options?.find(opt => opt.id === optionId);
              if (option) {
                selectedOptions.push(option.value);
              }
            }
          }
        }

        result[field.id] = selectedOptions;
      } else {
        result[field.id] = this.formGroup.get(field.id)?.value;
      }
    });

    return result;
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  hasError(field: FormField): boolean {
    const control = this.formGroup.get(field.id);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: FormField): string {
    const control = this.formGroup.get(field.id);

    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required';
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimum length is ${requiredLength} characters`;
    }

    if (control.errors['maxlength']) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      return `Maximum length is ${requiredLength} characters`;
    }

    if (control.errors['pattern']) {
      return 'Invalid format';
    }

    if (control.errors['min']) {
      const min = control.errors['min'].min;
      return `Minimum value is ${min}`;
    }

    if (control.errors['max']) {
      const max = control.errors['max'].max;
      return `Maximum value is ${max}`;
    }

    return 'Invalid value';
  }
} 