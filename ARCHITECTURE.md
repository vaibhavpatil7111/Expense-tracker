# ExpenseTracker Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  (User Interface - Login, Register, Dashboard, etc.)        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    ASP.NET Core MVC                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controllers Layer                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │   Account    │  │ Transaction  │  │  Category  │ │  │
│  │  │ Controller   │  │  Controller  │  │ Controller │ │  │
│  │  │              │  │              │  │            │ │  │
│  │  │ - Register   │  │ - Index      │  │ - Index    │ │  │
│  │  │ - Login      │  │ - AddOrEdit  │  │ - AddOrEdit│ │  │
│  │  │ - Logout     │  │ - Delete     │  │ - Delete   │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  │                                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │  Dashboard   │  │     Home     │                 │  │
│  │  │  Controller  │  │  Controller  │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Authentication Middleware                   │  │
│  │  - ASP.NET Core Identity                             │  │
│  │  - Cookie Authentication                             │  │
│  │  - Authorization Policies                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Models Layer                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │Application   │  │ Transaction  │  │  Category  │ │  │
│  │  │    User      │  │              │  │            │ │  │
│  │  │              │  │              │  │            │ │  │
│  │  │ - Id         │  │ - Id         │  │ - Id       │ │  │
│  │  │ - FullName   │  │ - Amount     │  │ - Title    │ │  │
│  │  │ - Email      │  │ - Note       │  │ - Icon     │ │  │
│  │  │ - Password   │  │ - Date       │  │ - Type     │ │  │
│  │  │              │  │ - UserId (FK)│  │ - UserId(FK)│ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Entity Framework Core (ORM)                   │  │
│  │  - DbContext: ApplicationDBContext                    │  │
│  │  - Change Tracking                                    │  │
│  │  - Query Translation                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   SQLite Database                            │
│                  (TransactionDB.db)                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │ AspNetUsers  │  │ Transactions │  │   Categories   │   │
│  │              │  │              │  │                │   │
│  │ - Id (PK)    │◄─┤ - UserId (FK)│  │ - UserId (FK)  ├──►│
│  │ - FullName   │  │ - CategoryId │◄─┤ - Id (PK)      │   │
│  │ - Email      │  │ - Amount     │  │ - Title        │   │
│  │ - Password   │  │ - Note       │  │ - Icon         │   │
│  └──────────────┘  │ - Date       │  │ - Type         │   │
│                    └──────────────┘  └────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Identity Tables                             │  │
│  │  - AspNetRoles                                        │  │
│  │  - AspNetUserRoles                                    │  │
│  │  - AspNetUserClaims                                   │  │
│  │  - AspNetUserLogins                                   │  │
│  │  - AspNetUserTokens                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Navigate to /Home
     ▼
┌─────────────────┐
│ Authorization   │
│ Middleware      │
└────┬────────────┘
     │
     │ 2. Check if authenticated
     ▼
┌─────────────────┐
│ Not Authenticated?
└────┬────────────┘
     │ Yes
     │ 3. Redirect to /Account/Login
     ▼
┌─────────────────┐
│  Login Page     │
└────┬────────────┘
     │
     │ 4. User enters credentials
     ▼
┌─────────────────┐
│ AccountController│
│ .Login()        │
└────┬────────────┘
     │
     │ 5. Validate credentials
     ▼
┌─────────────────┐
│ SignInManager   │
│ .PasswordSignIn()│
└────┬────────────┘
     │
     │ 6. Create authentication cookie
     ▼
┌─────────────────┐
│ Redirect to     │
│ /Home           │
└────┬────────────┘
     │
     │ 7. Access granted
     ▼
┌─────────────────┐
│ Home Page       │
│ (User's Data)   │
└─────────────────┘
```

## Data Isolation Flow

```
User A                          User B
  │                               │
  │ Login                         │ Login
  ▼                               ▼
┌─────────────┐               ┌─────────────┐
│ Session A   │               │ Session B   │
│ UserId: A1  │               │ UserId: B1  │
└──────┬──────┘               └──────┬──────┘
       │                             │
       │ Request Transactions        │ Request Transactions
       ▼                             ▼
┌──────────────────────────────────────────────┐
│         TransactionController                │
│                                              │
│  GetUserId() → A1              GetUserId() → B1
│       │                              │       │
│       ▼                              ▼       │
│  Query: WHERE UserId = A1   Query: WHERE UserId = B1
└──────┬──────────────────────────────┬───────┘
       │                              │
       ▼                              ▼
┌─────────────────────────────────────────────┐
│              Database                        │
│                                              │
│  Transactions                                │
│  ┌────────────────────────────────────────┐ │
│  │ Id │ Amount │ UserId │ CategoryId      │ │
│  ├────┼────────┼────────┼─────────────────┤ │
│  │ 1  │ 5000   │ A1     │ 1               │ │ ← User A's data
│  │ 2  │ 3000   │ A1     │ 2               │ │ ← User A's data
│  │ 3  │ 7000   │ B1     │ 3               │ │ ← User B's data
│  │ 4  │ 2000   │ B1     │ 4               │ │ ← User B's data
│  └────┴────────┴────────┴─────────────────┘ │
└─────────────────────────────────────────────┘
       │                              │
       │ Returns [1, 2]               │ Returns [3, 4]
       ▼                              ▼
User A sees only                User B sees only
transactions 1, 2               transactions 3, 4
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Route Protection                               │
│ - [Authorize] attribute on controllers                  │
│ - Redirects unauthenticated users to login              │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 2: User Identification                            │
│ - Extract UserId from authenticated claims              │
│ - GetUserId() method in each controller                 │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Query Filtering                                │
│ - All queries include .Where(x => x.UserId == userId)   │
│ - Automatic data isolation at query level               │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Ownership Verification                         │
│ - Update: Verify user owns record before modifying      │
│ - Delete: Verify user owns record before removing       │
│ - Return NotFound if ownership check fails              │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 5: Database Constraints                           │
│ - Foreign key constraints enforce referential integrity │
│ - Required fields prevent null UserId values            │
│ - Cascade delete removes user data when user is deleted │
└─────────────────────────────────────────────────────────┘
```

## Request Flow Example

### Creating a Transaction

```
1. User clicks "Add Transaction"
   ↓
2. Browser → GET /Transaction/AddOrEdit
   ↓
3. [Authorize] checks authentication
   ↓
4. TransactionController.AddOrEdit(id=0)
   ↓
5. PopulateCategories() → Filters by UserId
   ↓
6. Returns View with empty Transaction
   ↓
7. User fills form and submits
   ↓
8. Browser → POST /Transaction/AddOrEdit
   ↓
9. [ValidateAntiForgeryToken] checks CSRF token
   ↓
10. TransactionController.AddOrEdit(transaction)
    ↓
11. Set transaction.UserId = GetUserId()
    ↓
12. _context.Add(transaction)
    ↓
13. _context.SaveChangesAsync()
    ↓
14. Database inserts with UserId foreign key
    ↓
15. Redirect to /Transaction/Index
    ↓
16. Query filters by UserId
    ↓
17. Returns only user's transactions
```

## Component Relationships

```
ApplicationUser (1) ──────┐
                          │
                          │ Has Many
                          │
                          ├──────► Transaction (N)
                          │        - UserId (FK)
                          │        - CategoryId (FK)
                          │
                          └──────► Category (N)
                                   - UserId (FK)

Category (1) ────────────────────► Transaction (N)
                Has Many            - CategoryId (FK)
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  - Razor Views (.cshtml)                                │
│  - Bootstrap 5 (CSS Framework)                          │
│  - Font Awesome (Icons)                                 │
│  - Syncfusion Components                                │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  - ASP.NET Core MVC 8.0                                 │
│  - Controllers (Handle HTTP requests)                   │
│  - ViewModels (Data transfer objects)                   │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Business Layer                         │
│  - Models (Domain entities)                             │
│  - Validation Logic                                     │
│  - Business Rules                                       │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Access Layer                      │
│  - Entity Framework Core 8.0                            │
│  - ApplicationDBContext                                 │
│  - Migrations                                           │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Database Layer                         │
│  - SQLite                                               │
│  - TransactionDB.db                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 Cross-Cutting Concerns                   │
│  - ASP.NET Core Identity (Authentication)               │
│  - Authorization Middleware                             │
│  - Anti-Forgery Protection                              │
│  - Logging                                              │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
Development Environment:
┌─────────────────────────────────────────────────────────┐
│  Local Machine                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  dotnet run                                       │  │
│  │  ├─ Kestrel Web Server (localhost:5000)          │  │
│  │  ├─ Application Code                             │  │
│  │  └─ SQLite Database (TransactionDB.db)           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

Production Environment (Example):
┌─────────────────────────────────────────────────────────┐
│  Cloud Server (AWS/Azure/etc.)                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Reverse Proxy (Nginx/IIS)                       │  │
│  │  └─ ASP.NET Core Application                     │  │
│  │     ├─ Kestrel Web Server                        │  │
│  │     └─ Application Code                          │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Database Server                                  │  │
│  │  └─ PostgreSQL/MySQL/SQL Server                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Secure authentication and authorization
- ✅ Complete data isolation between users
- ✅ Scalable and maintainable codebase
- ✅ Industry-standard security practices
- ✅ Easy to test and debug
