import { ValidatorFn } from '@angular/forms';

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  DROPDOWN = 'dropdown',
  CHECKBOX_GROUP = 'checkbox_group',
  RADIO_GROUP = 'radio_group',
  DATE = 'date'
}

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  validation: FieldValidation;
  order: number;
}

export interface DynamicForm {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formData: Record<string, any>;
  submittedAt: Date;
} 