# User Authentication Implementation Guide

## Overview
Your ExpenseTracker application now has a complete user authentication system with secure data separation. Each user has their own isolated data that cannot be accessed by other users.

## Features Implemented

### 1. User Authentication
- **Registration**: New users can create accounts with email and password
- **Login**: Existing users can log in with their credentials
- **Logout**: Users can securely log out of their accounts
- **Session Management**: User sessions are maintained securely

### 2. Data Isolation
- **User-Specific Data**: All transactions and categories are linked to the user who created them
- **Secure Queries**: All database queries filter by UserId to ensure data separation
- **Foreign Key Relationships**: Database enforces referential integrity between users and their data

### 3. Security Features
- **Authorization**: All controllers (except Account) require authentication via `[Authorize]` attribute
- **Ownership Verification**: Update and delete operations verify the user owns the data before modifying
- **Password Requirements**: Minimum 6 characters (configurable in Program.cs)
- **Anti-Forgery Tokens**: All forms protected against CSRF attacks

## How It Works

### User Registration Flow
1. User visits `/Account/Register`
2. Fills in Full Name, Email, Password, and Confirm Password
3. System creates user account and automatically logs them in
4. Redirects to Home page

### User Login Flow
1. User visits `/Account/Login` (default landing page)
2. Enters Email and Password
3. Optional "Remember Me" checkbox for persistent login
4. System validates credentials and creates session
5. Redirects to Home page

### User Logout Flow
1. User clicks Logout button in header
2. System terminates session
3. Redirects to Login page

### Data Access Control
- **Categories**: Each category has a `UserId` field linking it to its creator
- **Transactions**: Each transaction has a `UserId` field linking it to its creator
- **Queries**: All data retrieval filters by `User.FindFirstValue(ClaimTypes.NameIdentifier)`
- **Updates**: Before updating, system verifies the record belongs to the current user
- **Deletes**: Before deleting, system verifies the record belongs to the current user

## Database Schema

### ApplicationUser (extends IdentityUser)
- Id (Primary Key)
- FullName
- Email
- UserName
- PasswordHash
- Navigation: Transactions, Categories

### Category
- CategoryId (Primary Key)
- Title (Required)
- Icon (Required)
- Type (Required)
- UserId (Required, Foreign Key to ApplicationUser)

### Transaction
- TransactionId (Primary Key)
- CategoryId (Required, Foreign Key to Category)
- Amount (Required)
- Note (Optional)
- Date (Required)
- UserId (Required, Foreign Key to ApplicationUser)

## Security Best Practices Implemented

1. **Authentication Required**: All pages except Login/Register require authentication
2. **Data Ownership Verification**: CRUD operations verify user owns the data
3. **SQL Injection Prevention**: Entity Framework parameterized queries
4. **CSRF Protection**: Anti-forgery tokens on all forms
5. **Password Hashing**: ASP.NET Identity handles secure password storage
6. **Foreign Key Constraints**: Database enforces data integrity

## Testing the System

### Test Scenario 1: User Registration and Data Isolation
1. Register User A (e.g., usera@example.com)
2. Create categories and transactions for User A
3. Logout
4. Register User B (e.g., userb@example.com)
5. Verify User B sees no data from User A
6. Create categories and transactions for User B
7. Logout and login as User A
8. Verify User A only sees their own data

### Test Scenario 2: Security Verification
1. Login as User A
2. Create a transaction (note the TransactionId in URL)
3. Logout and login as User B
4. Try to access User A's transaction by manually entering the URL
5. System should return NotFound or redirect

## Configuration

### Password Requirements (Program.cs)
```csharp
options.Password.RequireDigit = false;
options.Password.RequireLowercase = false;
options.Password.RequireUppercase = false;
options.Password.RequireNonAlphanumeric = false;
options.Password.RequiredLength = 6;
```

### Login Path Configuration (Program.cs)
```csharp
options.LoginPath = "/Account/Login";
options.AccessDeniedPath = "/Account/Login";
```

## Running the Application

```bash
cd "/home/ubantu/Vaibhav/Projects/Expense tracker"
dotnet restore
dotnet run --project "ExpenseTracker.csproj"
```

Visit `http://localhost:5000` (redirects to Login page)

## Files Modified/Created

### Controllers
- `AccountController.cs` - Handles registration, login, logout
- `TransactionController.cs` - Added user filtering and ownership verification
- `CategoryController.cs` - Added user filtering and ownership verification
- `DashboardController.cs` - Added user filtering
- `HomeController.cs` - Added user filtering

### Models
- `ApplicationUser.cs` - Extended IdentityUser with FullName and navigation properties
- `ApplicationDBContext.cs` - Configured Identity with ApplicationUser
- `LoginViewModel.cs` - Login form model
- `RegisterViewModel.cs` - Registration form model
- `Transaction.cs` - Added UserId foreign key and required attributes
- `Category.cs` - Added UserId foreign key and required attributes

### Views
- `Views/Account/Login.cshtml` - Login page
- `Views/Account/Register.cshtml` - Registration page
- `Views/Shared/_Layout.cshtml` - Added Logout button

### Configuration
- `Program.cs` - Configured Identity, authentication, and authorization

## Troubleshooting

### Issue: Can't login after registration
- Check database connection string in appsettings.json
- Verify migrations are applied: `dotnet ef database update`

### Issue: Data from other users is visible
- Verify all queries include `.Where(x => x.UserId == userId)`
- Check that UserId is set when creating new records

### Issue: Update operations fail
- Ensure ownership verification is in place before updating
- Check that the record exists and belongs to the current user

## Next Steps (Optional Enhancements)

1. **Email Confirmation**: Require email verification before login
2. **Password Reset**: Add forgot password functionality
3. **Two-Factor Authentication**: Add extra security layer
4. **User Profile**: Allow users to update their profile information
5. **Account Deletion**: Allow users to delete their accounts
6. **Role-Based Access**: Add admin roles for system management
7. **Audit Logging**: Track user actions for security monitoring
