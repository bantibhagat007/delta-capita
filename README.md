# Dynamic Form Builder Application

This is an Angular application for building and managing dynamic forms with permission controls. The application allows administrators to create, edit, and manage form templates with various field types, while standard users can view and submit form data.

## Features

### Form Builder Interface
- Drag-and-drop interface for building forms with different field types:
  - Text input (single-line and multi-line)
  - Dropdown select (with configurable options)
  - Checkbox groups
  - Date picker
  - Radio button groups
- Configurable field properties:
  - Field label
  - Required/optional setting
  - Help text
  - Validation rules (min/max length, pattern, etc.)

### Form Management
- List view of created form templates
- Edit existing templates
- Preview mode to test forms

### Form Submission
- Form filling interface for end-users
- Validation based on configured rules
- Submission to a mock API
- Success/error handling
- View submitted form data

### Authorization
- Two user roles:
  - Admin: Can create, edit, and delete form templates
  - User: Can only view and fill out forms
- Authorization check on all relevant actions
- Login screen with role selection

## Technical Implementation

- Angular 19 with TypeScript
- Standalone components with a tree-based structure
- Reactive Forms for form handling
- NgRx for state management
- Material UI with a custom rose-pink theme
- Responsive design

## Project Structure

- `src/app/features/` - Contains all feature modules
  - `auth/` - Authentication related components
  - `forms/` - Form management components
    - `form-builder/` - Form creation and editing
    - `form-preview/` - Form preview
    - `form-submission/` - Form submission
    - `forms-list/` - List of form templates
    - `submissions-list/` - View form submissions
    - `shared/` - Shared components
- `src/app/store/` - NgRx store implementation
  - `actions/` - Action definitions
  - `reducers/` - State reducers
  - `effects/` - Side effects
  - `models/` - Data models
- `src/app/services/` - Application services
  - `auth.service.ts` - Authentication service
  - `form.service.ts` - Form data service

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v8+)

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Navigate to `http://localhost:4200/` in your browser

### Usage

1. Login with either Admin or User role
2. As an Admin:
   - Create new form templates
   - Edit existing templates
   - View form submissions
3. As a User:
   - View available forms
   - Fill out and submit forms

## Implementation Notes

- The application uses a mock API service for data persistence
- Authentication is simulated with local storage
- Form data is stored in memory (would be replaced with actual API calls in a production application)

## Future Improvements

- Add unit tests for all components
- Implement end-to-end testing with Cypress or Playwright
- Add more field types (number, file upload, etc.)
- Implement form versioning
- Add form response analytics
