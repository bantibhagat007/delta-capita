# Delta Capita Dynamic Form Builder

A robust Angular-based form builder application that enables dynamic creation, management, and submission of forms with role-based access control. This enterprise-grade solution allows organizations to create custom forms, manage submissions, and control user access through a modern, responsive interface.

## Key Features

### Form Builder & Management
- Intuitive drag-and-drop interface for form creation
- Support for diverse field types:
  - Text fields (single & multi-line)
  - Dropdown menus with customizable options
  - Checkbox groups for multiple selections
  - Date pickers with format customization
  - Radio button groups
- Advanced field configuration:
  - Custom validation rules
  - Conditional field visibility
  - Required field marking
  - Helper text and tooltips
  - Placeholder text

### Security & Access Control
- Role-based access control (RBAC)
- Secure authentication system
- Data validation at multiple levels
- Session management
- Audit logging for form changes

### User Experience
- Responsive design for mobile and desktop
- Real-time form validation
- Auto-save functionality
- Form templates for quick starts
- Rich text editing capabilities

### Form Submission
- Form filling interface for end-users
- Validation based on configured rules
- Submission to a mock API
- Success/error handling
- View submitted form data

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

### System Requirements
- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- 2GB RAM minimum
- 1GB free disk space

### Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/delta-capita-project.git
   cd delta-capita-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm start
   ```
4. Access the application:
   - URL: http://localhost:4200
   - Default admin credentials: admin/admin123
   - Default user credentials: user/user123

### Production Deployment
1. Build the application:
   ```bash
   npm run build --prod
   ```
2. Deploy the contents of `dist/delta-capita-project` to your web server

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

## Technical Stack

- Frontend Framework: Angular 19
- State Management: NgRx
- UI Components: Angular Material
- Form Handling: Angular Reactive Forms
- Styling: SCSS with Material theming
- Build Tools: Angular CLI
- Package Manager: npm
- Version Control: Git

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and queries, please create an issue in the repository or contact the development team.
