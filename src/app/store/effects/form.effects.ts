import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { FormService } from '../../services/form.service';
import { FormActions } from '../actions/form.actions';
import { DynamicForm, FormSubmission } from '../models/form-field.model';

@Injectable()
export class FormEffects {
  private readonly actions$ = inject(Actions);
  private readonly formService = inject(FormService);

  loadForms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.loadForms),
      switchMap(() =>
        this.formService.getForms().pipe(
          map((forms: DynamicForm[]) => FormActions.loadFormsSuccess({ forms })),
          catchError(error => of(FormActions.loadFormsFailure({ error: String(error) })))
        )
      )
    )
  );

  loadForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.loadForm),
      switchMap(({ id }) =>
        this.formService.getForm(id).pipe(
          map((form: DynamicForm) => FormActions.loadFormSuccess({ form })),
          catchError(error => of(FormActions.loadFormFailure({ error: String(error) })))
        )
      )
    )
  );

  createForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.createForm),
      mergeMap(({ form }) =>
        this.formService.createForm(form).pipe(
          map((newForm: DynamicForm) => FormActions.createFormSuccess({ form: newForm })),
          catchError(error => of(FormActions.createFormFailure({ error: String(error) })))
        )
      )
    )
  );

  updateForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.updateForm),
      mergeMap(({ form }) =>
        this.formService.updateForm(form).pipe(
          map((updatedForm: DynamicForm) => FormActions.updateFormSuccess({ form: updatedForm })),
          catchError(error => of(FormActions.updateFormFailure({ error: String(error) })))
        )
      )
    )
  );

  deleteForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.deleteForm),
      mergeMap(({ id }) =>
        this.formService.deleteForm(id).pipe(
          map(() => FormActions.deleteFormSuccess({ id })),
          catchError(error => of(FormActions.deleteFormFailure({ error: String(error) })))
        )
      )
    )
  );

  submitForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.submitForm),
      mergeMap(({ formId, formData }) =>
        this.formService.submitForm(formId, formData).pipe(
          map((submission: FormSubmission) => FormActions.submitFormSuccess({ submission })),
          catchError(error => of(FormActions.submitFormFailure({ error: String(error) })))
        )
      )
    )
  );

  loadSubmissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.loadSubmissions),
      mergeMap(({ formId }) =>
        this.formService.getSubmissions(formId).pipe(
          map((submissions: FormSubmission[]) => FormActions.loadSubmissionsSuccess({ submissions })),
          catchError(error => of(FormActions.loadSubmissionsFailure({ error: String(error) })))
        )
      )
    )
  );
} 