import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { DynamicForm, FieldType, FormField, FormSubmission } from '../store/models/form-field.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private forms: DynamicForm[] = [];
  private submissions: FormSubmission[] = [];

  private readonly formsKey = 'forms_data';
  private readonly submissionsKey = 'submissions_data';

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const formsJson = localStorage.getItem(this.formsKey);
    if (formsJson) {
      this.forms = JSON.parse(formsJson);
    }

    const submissionsJson = localStorage.getItem(this.submissionsKey);
    if (submissionsJson) {
      this.submissions = JSON.parse(submissionsJson);
    }
  }

  private saveData(): void {
    localStorage.setItem(this.formsKey, JSON.stringify(this.forms));
    localStorage.setItem(this.submissionsKey, JSON.stringify(this.submissions));
  }

  getForms(): Observable<DynamicForm[]> {
    return of([...this.forms]).pipe(delay(500));
  }

  getForm(id: string): Observable<DynamicForm> {
    const form = this.forms.find(f => f.id === id);
    if (!form) {
      throw new Error(`Form with ID ${id} not found.`);
    }
    return of({ ...form }).pipe(delay(300));
  }

  createForm(form: DynamicForm): Observable<DynamicForm> {
    const newForm = {
      ...form,
      id: form.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.forms.push(newForm);
    this.saveData();

    return of({ ...newForm }).pipe(delay(500));
  }

  updateForm(form: DynamicForm): Observable<DynamicForm> {
    const index = this.forms.findIndex(f => f.id === form.id);
    if (index === -1) {
      throw new Error(`Form with ID ${form.id} not found.`);
    }

    const updatedForm = {
      ...form,
      updatedAt: new Date()
    };

    this.forms[index] = updatedForm;
    this.saveData();

    return of({ ...updatedForm }).pipe(delay(500));
  }

  deleteForm(id: string): Observable<void> {
    const index = this.forms.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error(`Form with ID ${id} not found.`);
    }

    this.forms.splice(index, 1);

    this.submissions = this.submissions.filter(s => s.formId !== id);
    this.saveData();

    return of(undefined).pipe(delay(500));
  }

  submitForm(formId: string, formData: Record<string, any>): Observable<FormSubmission> {
    const form = this.forms.find(f => f.id === formId);
    if (!form) {
      throw new Error(`Form with ID ${formId} not found.`);
    }

    const submission: FormSubmission = {
      id: uuidv4(),
      formId,
      formData,
      submittedAt: new Date()
    };

    this.submissions.push(submission);
    this.saveData();

    return of({ ...submission }).pipe(delay(700));
  }

  getSubmissions(formId: string): Observable<FormSubmission[]> {
    const formSubmissions = this.submissions
      .filter(s => s.formId === formId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return of([...formSubmissions]).pipe(delay(500));
  }

  private loadSampleData(): void {
    if (this.forms.length === 0) {
      this.forms.push({
        id: '1',
        title: 'Contact Form',
        description: 'Sample contact form with basic fields',
        createdAt: new Date(),
        updatedAt: new Date(),
        fields: [
          {
            id: '101',
            type: FieldType.TEXT,
            label: 'Full Name',
            placeholder: 'Enter your full name',
            helpText: 'Please provide your first and last name',
            validation: { required: true, minLength: 2 },
            order: 0
          },
          {
            id: '102',
            type: FieldType.TEXT,
            label: 'Email',
            placeholder: 'Enter your email address',
            helpText: 'We will use this to contact you',
            validation: {
              required: true,
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
            },
            order: 1
          },
          {
            id: '103',
            type: FieldType.TEXTAREA,
            label: 'Message',
            placeholder: 'Enter your message',
            validation: { required: true, minLength: 10, maxLength: 500 },
            order: 2
          }
        ]
      });
    }
  }
} 