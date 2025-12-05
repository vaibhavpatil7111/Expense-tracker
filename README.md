# ExpenseTracker (ASP.NET Core MVC scaffold)

Minimal ASP.NET Core MVC scaffold placed inside the project workspace. It contains a basic `Expense` model, in-memory controller and simple views.

Run locally (requires .NET 7 SDK):

```bash
cd "/home/ubantu/Vaibhav/Projects/Expense tracker"
dotnet restore
dotnet run --project "ExpenseTracker.csproj"
```

Visit `http://localhost:5000` (or the port shown by `dotnet run`).

Notes:

- This is a minimal starting point. For production or persistent storage, add EF Core and a database.
- The sample uses an in-memory static list for simplicity.
