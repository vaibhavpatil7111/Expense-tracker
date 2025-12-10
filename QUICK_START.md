# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Run the Application
```bash
cd "/home/ubantu/Vaibhav/Projects/Expense tracker"
dotnet run --project ExpenseTracker.csproj
```

### Step 2: Open Your Browser
Navigate to: `http://localhost:5000`

### Step 3: Create Your Account
1. Click "Register here"
2. Fill in your details
3. Start tracking expenses!

---

## 📋 First Time Setup

### Create Your First Category
1. After login, click "Categories" in the navigation
2. Click "Add Category"
3. Fill in:
   - **Title**: e.g., "Groceries"
   - **Icon**: e.g., "🛒" (any emoji or icon)
   - **Type**: Choose "Expense" or "Income"
4. Click "Save"

### Create Your First Transaction
1. Click "Transactions" in the navigation
2. Click "Add Transaction" or the "+" button
3. Fill in:
   - **Category**: Select from your categories
   - **Amount**: Enter the amount (e.g., 5000)
   - **Note**: Optional description
   - **Date**: Select the date
4. Click "Save"

### View Your Dashboard
1. Click "Dashboard" in the navigation
2. See your financial overview
3. View charts and statistics

---

## 👥 Testing with Multiple Users

### Create Second User
1. Click "Logout"
2. Click "Register here"
3. Create a new account with different email
4. Notice: No data from the first user is visible!

### Verify Data Isolation
1. Create categories and transactions for the second user
2. Logout and login as the first user
3. Confirm: Each user only sees their own data

---

## 🔐 Security Features

### What's Protected
- ✅ All pages require login (except Login/Register)
- ✅ Each user has completely separate data
- ✅ Users cannot access other users' data
- ✅ All operations verify ownership

### Password Requirements
- Minimum 6 characters
- No special requirements (configurable)

---

## 📁 Project Structure

```
ExpenseTracker/
├── Controllers/          # Handle HTTP requests
│   ├── AccountController.cs      # Login, Register, Logout
│   ├── TransactionController.cs  # Transaction CRUD
│   ├── CategoryController.cs     # Category CRUD
│   ├── DashboardController.cs    # Dashboard view
│   └── HomeController.cs         # Home page
├── Models/              # Data models
│   ├── ApplicationUser.cs        # User model
│   ├── Transaction.cs            # Transaction model
│   ├── Category.cs               # Category model
│   └── ApplicationDBContext.cs   # Database context
├── Views/               # UI templates
│   ├── Account/         # Login, Register pages
│   ├── Transaction/     # Transaction views
│   ├── Category/        # Category views
│   └── Shared/          # Layout, shared components
├── wwwroot/             # Static files (CSS, JS)
├── Migrations/          # Database migrations
├── TransactionDB.db     # SQLite database
└── Program.cs           # Application configuration
```

---

## 🛠️ Common Commands

### Run the Application
```bash
dotnet run --project ExpenseTracker.csproj
```

### Build the Application
```bash
dotnet build ExpenseTracker.csproj
```

### Reset the Database
```bash
rm -f TransactionDB.db TransactionDB.db-shm TransactionDB.db-wal
dotnet ef database update
```

### Create a New Migration
```bash
dotnet ef migrations add MigrationName
```

### Apply Migrations
```bash
dotnet ef database update
```

---

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)** - Complete authentication guide
- **[SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)** - Security features
- **[TEST_AUTHENTICATION.md](TEST_AUTHENTICATION.md)** - Testing guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Implementation details

---

## ❓ Troubleshooting

### Can't Login?
- Check that you registered with the correct email
- Verify password is at least 6 characters
- Try registering a new account

### Database Error?
```bash
# Reset the database
rm -f TransactionDB.db TransactionDB.db-shm TransactionDB.db-wal
dotnet ef database update
```

### Build Error?
```bash
# Clean and rebuild
dotnet clean
dotnet restore
dotnet build
```

### Port Already in Use?
- Stop other applications using port 5000
- Or change the port in Properties/launchSettings.json

---

## 🎯 Key Features

### Authentication
- ✅ User registration
- ✅ User login
- ✅ User logout
- ✅ Session management

### Data Management
- ✅ Create, read, update, delete transactions
- ✅ Create, read, update, delete categories
- ✅ Dashboard with financial overview
- ✅ Date-based transaction tracking

### Security
- ✅ Password hashing
- ✅ Data isolation per user
- ✅ Ownership verification
- ✅ CSRF protection
- ✅ Authorization on all routes

---

## 🚦 Quick Test

### 5-Minute Test
1. **Start**: `dotnet run --project ExpenseTracker.csproj`
2. **Register**: Create account at `http://localhost:5000`
3. **Category**: Add a category (e.g., "Food" 🍔)
4. **Transaction**: Add a transaction (e.g., $50 for lunch)
5. **Dashboard**: View your data on the dashboard
6. **Logout**: Click logout button
7. **Register**: Create second account
8. **Verify**: Confirm no data from first user is visible

✅ If all steps work, your system is ready!

---

## 💡 Tips

### Best Practices
- Create categories before transactions
- Use descriptive category names
- Add notes to transactions for clarity
- Check dashboard regularly for insights

### Category Examples
- **Income**: 💰 Salary, 💼 Freelance, 🎁 Gifts
- **Expense**: 🛒 Groceries, 🏠 Rent, 🚗 Transport, 🍔 Food

### Security Tips
- Use strong passwords
- Logout when done
- Don't share your credentials
- Each user should have their own account

---

## 🎉 You're Ready!

Your ExpenseTracker is now fully functional with:
- ✅ User authentication
- ✅ Secure data isolation
- ✅ Complete CRUD operations
- ✅ Beautiful UI
- ✅ Dashboard analytics

Start tracking your expenses today! 💰📊
