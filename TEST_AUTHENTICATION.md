# Authentication System Test Guide

## Prerequisites
- Application is running: `dotnet run --project ExpenseTracker.csproj`
- Browser is open at `http://localhost:5000`

## Test 1: User Registration ✓

### Steps:
1. Navigate to `http://localhost:5000` (should redirect to `/Account/Login`)
2. Click "Register here" link
3. Fill in the registration form:
   - Full Name: `Test User One`
   - Email: `user1@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Register" button

### Expected Results:
- ✅ User is created successfully
- ✅ User is automatically logged in
- ✅ Redirected to Home page
- ✅ Header shows Logout button
- ✅ No data is displayed (new user has no transactions/categories)

## Test 2: Create User-Specific Data ✓

### Steps:
1. While logged in as `user1@test.com`:
2. Navigate to Categories (`/Category`)
3. Click "Add Category"
4. Create a category:
   - Title: `Groceries`
   - Icon: `🛒`
   - Type: `Expense`
5. Save the category
6. Navigate to Transactions (`/Transaction`)
7. Click "Add Transaction"
8. Create a transaction:
   - Category: `🛒 Groceries`
   - Amount: `5000`
   - Note: `Weekly shopping`
   - Date: Today
9. Save the transaction

### Expected Results:
- ✅ Category is created and visible in Categories list
- ✅ Transaction is created and visible in Transactions list
- ✅ Dashboard shows the transaction data

## Test 3: User Logout ✓

### Steps:
1. Click "Logout" button in header
2. Confirm logout

### Expected Results:
- ✅ User is logged out
- ✅ Redirected to Login page
- ✅ Cannot access protected pages without logging in

## Test 4: Second User Registration ✓

### Steps:
1. On Login page, click "Register here"
2. Fill in the registration form:
   - Full Name: `Test User Two`
   - Email: `user2@test.com`
   - Password: `password456`
   - Confirm Password: `password456`
3. Click "Register" button

### Expected Results:
- ✅ Second user is created successfully
- ✅ User is automatically logged in
- ✅ Redirected to Home page
- ✅ No data is displayed (User 2 should NOT see User 1's data)

## Test 5: Data Isolation Verification ✓

### Steps:
1. While logged in as `user2@test.com`:
2. Navigate to Categories (`/Category`)
3. Verify the list is empty
4. Navigate to Transactions (`/Transaction`)
5. Verify the list is empty
6. Navigate to Dashboard
7. Verify no data is displayed

### Expected Results:
- ✅ User 2 sees NO categories from User 1
- ✅ User 2 sees NO transactions from User 1
- ✅ Data is completely isolated between users

## Test 6: Create Data for Second User ✓

### Steps:
1. While logged in as `user2@test.com`:
2. Create a category:
   - Title: `Salary`
   - Icon: `💰`
   - Type: `Income`
3. Create a transaction:
   - Category: `💰 Salary`
   - Amount: `50000`
   - Note: `Monthly salary`
   - Date: Today

### Expected Results:
- ✅ User 2's data is created successfully
- ✅ User 2 can see their own data

## Test 7: Switch Between Users ✓

### Steps:
1. Logout from User 2
2. Login as User 1 (`user1@test.com` / `password123`)
3. Navigate to Categories and Transactions
4. Verify User 1 sees ONLY their data (Groceries category and shopping transaction)
5. Logout from User 1
6. Login as User 2 (`user2@test.com` / `password456`)
7. Navigate to Categories and Transactions
8. Verify User 2 sees ONLY their data (Salary category and salary transaction)

### Expected Results:
- ✅ User 1 sees only Groceries and shopping transaction
- ✅ User 2 sees only Salary and salary transaction
- ✅ No data mixing between users

## Test 8: Security - Unauthorized Access Attempt ✓

### Steps:
1. Login as User 1
2. Create a transaction and note the URL (e.g., `/Transaction/AddOrEdit/1`)
3. Note the transaction ID in the URL
4. Logout
5. Login as User 2
6. Manually navigate to User 1's transaction edit URL (e.g., `/Transaction/AddOrEdit/1`)

### Expected Results:
- ✅ User 2 cannot access User 1's transaction
- ✅ System returns NotFound or redirects
- ✅ No unauthorized data access is possible

## Test 9: Update Operation Security ✓

### Steps:
1. Login as User 1
2. Edit one of User 1's transactions
3. Change the amount and save
4. Verify the update is successful
5. Logout and login as User 2
6. Try to access User 1's transaction ID directly

### Expected Results:
- ✅ User 1 can update their own data
- ✅ User 2 cannot access or update User 1's data
- ✅ Ownership verification works correctly

## Test 10: Delete Operation Security ✓

### Steps:
1. Login as User 1
2. Delete one of User 1's transactions
3. Verify the deletion is successful
4. Logout and login as User 2
5. Verify User 2's data is unaffected

### Expected Results:
- ✅ User 1 can delete their own data
- ✅ User 2's data remains intact
- ✅ No cross-user data deletion is possible

## Test 11: Login Validation ✓

### Steps:
1. Logout if logged in
2. Try to login with incorrect credentials:
   - Email: `user1@test.com`
   - Password: `wrongpassword`
3. Try to login with non-existent user:
   - Email: `nonexistent@test.com`
   - Password: `password123`

### Expected Results:
- ✅ Login fails with appropriate error message
- ✅ User is not authenticated
- ✅ Remains on login page

## Test 12: Registration Validation ✓

### Steps:
1. Try to register with mismatched passwords:
   - Full Name: `Test User`
   - Email: `test@test.com`
   - Password: `password123`
   - Confirm Password: `password456`
2. Try to register with existing email:
   - Email: `user1@test.com` (already exists)

### Expected Results:
- ✅ Registration fails with validation error
- ✅ Appropriate error messages are displayed
- ✅ User is not created

## Test 13: Protected Routes ✓

### Steps:
1. Logout if logged in
2. Try to access protected routes directly:
   - `/Home`
   - `/Dashboard`
   - `/Category`
   - `/Transaction`

### Expected Results:
- ✅ All protected routes redirect to `/Account/Login`
- ✅ Cannot access any data without authentication
- ✅ After login, can access all protected routes

## Test Summary

All tests should pass with the following confirmations:

1. ✅ Users can register and login successfully
2. ✅ Each user has completely isolated data
3. ✅ Users cannot access other users' data
4. ✅ CRUD operations verify ownership
5. ✅ Authentication is required for all protected pages
6. ✅ Validation works correctly on all forms
7. ✅ Security measures prevent unauthorized access

## Automated Testing (Optional)

For automated testing, consider implementing:
- Unit tests for controllers
- Integration tests for authentication flow
- End-to-end tests with Selenium or Playwright

## Performance Testing (Optional)

Test with multiple users:
1. Create 10+ user accounts
2. Create 100+ transactions per user
3. Verify query performance
4. Check that UserId indexes are being used
