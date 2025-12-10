# ExpenseTracker - Full-Featured Expense Management System

A complete ASP.NET Core MVC application with user authentication, database persistence, and secure data isolation.

## Features

- ✅ **User Authentication**: Registration, Login, and Logout
- ✅ **Data Isolation**: Each user has their own separate data
- ✅ **Transaction Management**: Track income and expenses
- ✅ **Category Management**: Organize transactions by categories
- ✅ **Dashboard**: Visual overview of financial data
- ✅ **Database Persistence**: SQLite database with Entity Framework Core
- ✅ **Security**: Authorization, ownership verification, and CSRF protection

## Quick Start

Run locally (requires .NET 8 SDK):

```bash
cd "/home/ubantu/Vaibhav/Projects/Expense tracker"
dotnet restore
dotnet run --project "ExpenseTracker.csproj"
```

Visit `http://localhost:5000` (or the port shown by `dotnet run`).

The application will redirect you to the login page. Create a new account to get started.

## Documentation

- **[AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)** - Complete guide to the authentication system
- **[SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)** - Security features and verification

## Technology Stack

- ASP.NET Core 8.0 MVC
- Entity Framework Core 8.0
- ASP.NET Core Identity
- SQLite Database
- Bootstrap 5
- Font Awesome Icons
- Syncfusion Components

## Database

The application uses SQLite for data storage. The database file `TransactionDB.db` is created automatically on first run.

To reset the database:
```bash
rm -f TransactionDB.db TransactionDB.db-shm TransactionDB.db-wal
dotnet ef database update
```

## Security

All user data is isolated and secure:
- Users can only access their own transactions and categories
- All CRUD operations verify ownership before execution
- Passwords are hashed using ASP.NET Identity
- Forms are protected with anti-forgery tokens

## Default Configuration

- Minimum password length: 6 characters
- No special character requirements (configurable in Program.cs)
- Session-based authentication with optional "Remember Me"
- Default route: `/Account/Login`
