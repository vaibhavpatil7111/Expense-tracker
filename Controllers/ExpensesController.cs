using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.Models;
using System.Collections.Generic;

namespace ExpenseTracker.Controllers
{
    public class ExpensesController : Controller
    {
        private static readonly List<Expense> _expenses = new();

        public IActionResult Index()
        {
            return View(_expenses);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Expense expense)
        {
            if (ModelState.IsValid)
            {
                expense.Id = _expenses.Count + 1;
                _expenses.Add(expense);
                return RedirectToAction("Index");
            }
            return View(expense);
        }
    }
}
