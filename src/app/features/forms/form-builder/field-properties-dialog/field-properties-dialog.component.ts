import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { v4 as uuidv4 } from 'uuid';
import { FieldType, FormField, FieldOption } from '../../../../store/models/form-field.model';

interface DialogData {
  field: FormField;
}

@Component({
  selector: 'app-field-properties-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    MatSlideToggleModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isNewField ? 'Add Field' : 'Edit Field' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="fieldForm">
        <mat-tab-group>
          <mat-tab label="General">
            <div class="tab-content">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Field Label</mat-label>
                <input matInput formControlName="label" placeholder="Enter field label">
                <mat-error *ngIf="fieldForm.get('label')?.hasError('required')">
                  Label is required
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Help Text</mat-label>
                <input matInput formControlName="helpText" placeholder="Enter help text">
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Placeholder</mat-label>
                <input matInput formControlName="placeholder" placeholder="Enter placeholder text">
              </mat-form-field>
              
              <div class="field-options-section" *ngIf="showOptionsEditor">
                <h3>Options</h3>
                
                <div formArrayName="options">
                  <div 
                    *ngFor="let option of optionsArray.controls; let i = index" 
                    [formGroupName]="i"
                    class="option-row"
                  >
                    <mat-form-field appearance="outline" class="option-label">
                      <mat-label>Label</mat-label>
                      <input matInput formControlName="label" placeholder="Option label">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline" class="option-value">
                      <mat-label>Value</mat-label>
                      <input matInput formControlName="value" placeholder="Option value">
                    </mat-form-field>
                    
                    <button 
                      mat-icon-button 
                      color="warn" 
                      type="button" 
                      (click)="removeOption(i)"
                      aria-label="Remove option"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
                
                <button 
                  mat-stroked-button 
                  color="primary" 
                  type="button" 
                  (click)="addOption()"
                  class="add-option-btn"
                >
                  <mat-icon>add</mat-icon>
                  Add Option
                </button>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Validation">
            <div class="tab-content" formGroupName="validation">
              <div class="validation-toggle">
                <mat-slide-toggle formControlName="required">Required</mat-slide-toggle>
              </div>
              
              <ng-container *ngIf="showTextValidation">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Minimum Length</mat-label>
                  <input 
                    matInput 
                    formControlName="minLength" 
                    placeholder="Minimum length" 
                    type="number"
                    min="0"
                  >
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Maximum Length</mat-label>
                  <input 
                    matInput 
                    formControlName="maxLength" 
                    placeholder="Maximum length" 
                    type="number"
                    min="0"
                  >
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Pattern</mat-label>
                  <input matInput formControlName="pattern" placeholder="Regular expression">
                  <mat-hint>JavaScript regular expression pattern</mat-hint>
                </mat-form-field>
              </ng-container>
              
              <ng-container *ngIf="showNumberValidation">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Minimum Value</mat-label>
                  <input 
                    matInput 
                    formControlName="min" 
                    placeholder="Minimum value" 
                    type="number"
                  >
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Maximum Value</mat-label>
                  <input 
                    matInput 
                    formControlName="max" 
                    placeholder="Maximum value" 
                    type="number"
                  >
                </mat-form-field>
              </ng-container>
            </div>
          </mat-tab>
        </mat-tab-group>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button 
        mat-raised-button 
        color="primary" 
        [disabled]="fieldForm.invalid" 
        (click)="save()"
      >
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tab-content {
      padding: 16px 0;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .option-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .option-label {
      flex: 3;
      margin-right: 8px;
    }
    
    .option-value {
      flex: 2;
      margin-right: 8px;
    }
    
    .add-option-btn {
      margin-top: 8px;
    }
    
    .validation-toggle {
      margin-bottom: 16px;
    }
    
    .field-options-section {
      margin-top: 16px;
      border-top: 1px solid #e0e0e0;
      padding-top: 16px;
    }
  `]
})
export class FieldPropertiesDialogComponent implements OnInit {
  fieldForm: FormGroup;
  fieldType: FieldType;
  isNewField: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FieldPropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.fieldType = data.field.type;
    this.isNewField = !data.field.label;

    this.fieldForm = this.fb.group({
      id: [data.field.id],
      type: [data.field.type],
      label: [data.field.label || '', Validators.required],
      helpText: [data.field.helpText || ''],
      placeholder: [data.field.placeholder || ''],
      order: [data.field.order],
      options: this.fb.array([]),
      validation: this.fb.group({
        required: [data.field.validation?.required || false],
        minLength: [data.field.validation?.minLength || null],
        maxLength: [data.field.validation?.maxLength || null],
        pattern: [data.field.validation?.pattern || ''],
        min: [data.field.validation?.min || null],
        max: [data.field.validation?.max || null]
      })
    });

    if (data.field.options) {
      data.field.options.forEach(option => {
        this.addOption(option);
      });
    }
  }

  ngOnInit(): void {
    if (this.showOptionsEditor && this.optionsArray.length === 0) {
      this.addOption({ id: uuidv4(), label: 'Option 1', value: 'option1' });
      this.addOption({ id: uuidv4(), label: 'Option 2', value: 'option2' });
    }
  }

  get optionsArray(): FormArray {
    return this.fieldForm.get('options') as FormArray;
  }

  get showOptionsEditor(): boolean {
    return (
      this.fieldType === FieldType.DROPDOWN ||
      this.fieldType === FieldType.CHECKBOX_GROUP ||
      this.fieldType === FieldType.RADIO_GROUP
    );
  }

  get showTextValidation(): boolean {
    return (
      this.fieldType === FieldType.TEXT ||
      this.fieldType === FieldType.TEXTAREA
    );
  }

  get showNumberValidation(): boolean {
    return false;
  }

  addOption(option?: FieldOption): void {
    const optionForm = this.fb.group({
      id: [option?.id || uuidv4()],
      label: [option?.label || '', Validators.required],
      value: [option?.value || '', Validators.required]
    });

    this.optionsArray.push(optionForm);
  }

  removeOption(index: number): void {
    this.optionsArray.removeAt(index);
  }

  save(): void {
    if (this.fieldForm.valid) {
      const validation = this.fieldForm.value.validation;

      Object.keys(validation).forEach(key => {
        if (validation[key] === null || validation[key] === undefined || validation[key] === '') {
          delete validation[key];
        }
      });

      const result: FormField = {
        ...this.fieldForm.value,
        validation
      };

      this.dialogRef.close(result);
    }
  }
} 