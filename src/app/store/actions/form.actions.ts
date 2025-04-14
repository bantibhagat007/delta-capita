import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DynamicForm, FormField, FormSubmission } from '../models/form-field.model';

export const FormActions = createActionGroup({
  source: 'Forms',
  events: {
    'Load Forms': emptyProps(),
    'Load Forms Success': props<{ forms: DynamicForm[] }>(),
    'Load Forms Failure': props<{ error: string }>(),

    'Load Form': props<{ id: string }>(),
    'Load Form Success': props<{ form: DynamicForm }>(),
    'Load Form Failure': props<{ error: string }>(),

    'Create Form': props<{ form: DynamicForm }>(),
    'Create Form Success': props<{ form: DynamicForm }>(),
    'Create Form Failure': props<{ error: string }>(),

    'Update Form': props<{ form: DynamicForm }>(),
    'Update Form Success': props<{ form: DynamicForm }>(),
    'Update Form Failure': props<{ error: string }>(),

    'Delete Form': props<{ id: string }>(),
    'Delete Form Success': props<{ id: string }>(),
    'Delete Form Failure': props<{ error: string }>(),

    'Submit Form': props<{ formId: string; formData: Record<string, any> }>(),
    'Submit Form Success': props<{ submission: FormSubmission }>(),
    'Submit Form Failure': props<{ error: string }>(),

    'Load Submissions': props<{ formId: string }>(),
    'Load Submissions Success': props<{ submissions: FormSubmission[] }>(),
    'Load Submissions Failure': props<{ error: string }>()
  }
}); 