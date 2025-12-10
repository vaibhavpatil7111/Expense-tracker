using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ExpenseTracker.Controllers
{
    [Authorize]
    public class TransactionController : Controller
    {
        private readonly ApplicationDBContext _context;

        public TransactionController(ApplicationDBContext context)
        {
            _context = context;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

        // GET: Transaction
        public async Task<IActionResult> Index()
        {
            var userId = GetUserId();
            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.UserId == userId)
                .ToListAsync();
            return View(transactions);
        }

        // GET: Transaction/AddOrEdit
        public IActionResult AddOrEdit(int id = 0)
        {
            PopulateCategories();
            var userId = GetUserId();
            if (id != 0)
            {
                var transaction = _context.Transactions.FirstOrDefault(t => t.TransactionId == id && t.UserId == userId);
                if (transaction == null)
                {
                    return NotFound();
                }
                return View(transaction);
            }
            else
            {
                return View(new Transaction());
            }
        }

        // POST: Transaction/AddOrEdit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddOrEdit(Transaction transaction)
        {
            var userId = GetUserId();
            transaction.UserId = userId;
            
            // Remove UserId from ModelState validation
            ModelState.Remove("UserId");
            ModelState.Remove("User");
            ModelState.Remove("Category");
            
            if (ModelState.IsValid)
            {
                if (transaction.TransactionId == 0)
                {
                    _context.Add(transaction);
                }
                else
                {
                    var existing = await _context.Transactions.FirstOrDefaultAsync(t => t.TransactionId == transaction.TransactionId && t.UserId == userId);
                    if (existing == null) return NotFound();
                    existing.CategoryId = transaction.CategoryId;
                    existing.Amount = transaction.Amount;
                    existing.Note = transaction.Note;
                    existing.Date = transaction.Date;
                }
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            PopulateCategories();
            return View(transaction);
        }

        // GET: Transaction/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var userId = GetUserId();
            var transaction = await _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefaultAsync(m => m.TransactionId == id && m.UserId == userId);
            if (transaction == null)
            {
                return NotFound();
            }

            return View(transaction);
        }

        // POST: Transaction/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var userId = GetUserId();
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.TransactionId == id && t.UserId == userId);
            if (transaction != null)
            {
                _context.Transactions.Remove(transaction);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [NonAction]
        public void PopulateCategories()
        {
            var userId = GetUserId();
            var categories = _context.Categories.Where(c => c.UserId == userId).ToList();
            var categoryList = categories.Select(c => new SelectListItem
            {
                Value = c.CategoryId.ToString(),
                Text = $"{c.Icon} {c.Title}"
            }).ToList();
            ViewBag.Categories = categoryList;
        }
    }
}
