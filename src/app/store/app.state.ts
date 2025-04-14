import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromForm from './reducers/form.reducer';
import * as fromAuth from './reducers/auth.reducer';

export interface AppState {
  form: fromForm.State;
  auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  form: fromForm.reducer,
  auth: fromAuth.reducer
};

export const metaReducers: MetaReducer<AppState>[] = []; 