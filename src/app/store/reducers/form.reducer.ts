import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { DynamicForm, FormSubmission } from '../models/form-field.model';
import { FormActions } from '../actions/form.actions';

export const formsAdapter = createEntityAdapter<DynamicForm>();
export const submissionsAdapter = createEntityAdapter<FormSubmission>();

export interface FormsState extends EntityState<DynamicForm> {
  selectedFormId: string | null;
  loading: boolean;
  error: string | null;
}

export interface SubmissionsState extends EntityState<FormSubmission> {
  loading: boolean;
  error: string | null;
}

export interface State {
  forms: FormsState;
  submissions: SubmissionsState;
}

export const initialFormsState: FormsState = formsAdapter.getInitialState({
  selectedFormId: null,
  loading: false,
  error: null
});

export const initialSubmissionsState: SubmissionsState = submissionsAdapter.getInitialState({
  loading: false,
  error: null
});

export const initialState: State = {
  forms: initialFormsState,
  submissions: initialSubmissionsState
};

export const reducer = createReducer(
  initialState,

  on(FormActions.loadForms, (state) => ({
    ...state,
    forms: {
      ...state.forms,
      loading: true,
      error: null
    }
  })),

  on(FormActions.loadFormsSuccess, (state, { forms }) => ({
    ...state,
    forms: formsAdapter.setAll(forms, {
      ...state.forms,
      loading: false,
      error: null
    })
  })),

  on(FormActions.loadFormsFailure, (state, { error }) => ({
    ...state,
    forms: {
      ...state.forms,
      loading: false,
      error
    }
  })),

  on(FormActions.loadForm, (state, { id }) => ({
    ...state,
    forms: {
      ...state.forms,
      selectedFormId: id,
      loading: true,
      error: null
    }
  })),

  on(FormActions.loadFormSuccess, (state, { form }) => ({
    ...state,
    forms: formsAdapter.upsertOne(form, {
      ...state.forms,
      loading: false,
      error: null
    })
  })),

  on(FormActions.loadFormFailure, (state, { error }) => ({
    ...state,
    forms: {
      ...state.forms,
      loading: false,
      error
    }
  })),

  on(FormActions.createForm, (state) => ({
    ...state,
    forms: {
      ...state.forms,
      loading: true,
      error: null
    }
  })),

  on(FormActions.createFormSuccess, (state, { form }) => ({
    ...state,
    forms: formsAdapter.addOne(form, {
      ...state.forms,
      loading: false,
      error: null
    })
  })),

  on(FormActions.createFormFailure, (state, { error }) => ({
    ...state,
    forms: {
      ...state.forms,
      loading: false,
      error
    }
  })),

  on(FormActions.updateForm, (state) => ({
    ...state,
    forms: {
      ...state.forms,
      loading: true,
      error: null
    }
  })),

  on(FormActions.updateFormSuccess, (state, { form }) => ({
    ...state,
    forms: formsAdapter.updateOne(
      { id: form.id, changes: form },
      {
        ...state.forms,
        loading: false,
        error: null
      }
    )
  })),

  on(FormActions.updateFormFailure, (state, { error }) => ({
    ...state,
    forms: {
      ...state.forms,
      loading: false,
      error
    }
  })),

  on(FormActions.deleteForm, (state) => ({
    ...state,
    forms: {
      ...state.forms,
      loading: true,
      error: null
    }
  })),

  on(FormActions.deleteFormSuccess, (state, { id }) => ({
    ...state,
    forms: formsAdapter.removeOne(id, {
      ...state.forms,
      loading: false,
      error: null
    })
  })),

  on(FormActions.deleteFormFailure, (state, { error }) => ({
    ...state,
    forms: {
      ...state.forms,
      loading: false,
      error
    }
  })),

  on(FormActions.submitForm, (state) => ({
    ...state,
    submissions: {
      ...state.submissions,
      loading: true,
      error: null
    }
  })),

  on(FormActions.submitFormSuccess, (state, { submission }) => ({
    ...state,
    submissions: submissionsAdapter.addOne(submission, {
      ...state.submissions,
      loading: false,
      error: null
    })
  })),

  on(FormActions.submitFormFailure, (state, { error }) => ({
    ...state,
    submissions: {
      ...state.submissions,
      loading: false,
      error
    }
  })),

  on(FormActions.loadSubmissions, (state) => ({
    ...state,
    submissions: {
      ...state.submissions,
      loading: true,
      error: null
    }
  })),

  on(FormActions.loadSubmissionsSuccess, (state, { submissions }) => ({
    ...state,
    submissions: submissionsAdapter.setAll(submissions, {
      ...state.submissions,
      loading: false,
      error: null
    })
  })),

  on(FormActions.loadSubmissionsFailure, (state, { error }) => ({
    ...state,
    submissions: {
      ...state.submissions,
      loading: false,
      error
    }
  }))
);

export const getFormsState = (state: State) => state.forms;
export const getSubmissionsState = (state: State) => state.submissions; 