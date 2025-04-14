import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { FormsListComponent } from './features/forms/forms-list/forms-list.component';
import { FormBuilderComponent } from './features/forms/form-builder/form-builder.component';
import { FormPreviewComponent } from './features/forms/form-preview/form-preview.component';
import { FormSubmissionComponent } from './features/forms/form-submission/form-submission.component';
import { SubmissionsListComponent } from './features/forms/submissions-list/submissions-list.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'forms', 
    component: FormsListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'forms/new', 
    component: FormBuilderComponent,
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'forms/:id/edit', 
    component: FormBuilderComponent,
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'forms/:id/view', 
    component: FormPreviewComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'forms/:id/fill', 
    component: FormSubmissionComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'forms/:id/submissions', 
    component: SubmissionsListComponent,
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: 'forms' }
];
