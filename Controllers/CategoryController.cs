using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ExpenseTracker.Controllers
{
    [Authorize]
    public class CategoryController : Controller
    {
        private readonly ApplicationDBContext _context;

        public CategoryController(ApplicationDBContext context)
        {
            _context = context;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

        // GET: Category
        public async Task<IActionResult> Index()
        {
            var userId = GetUserId();
            return View(await _context.Categories.Where(c => c.UserId == userId).ToListAsync());
        }

        // GET: Category/Add Or Edit
        public IActionResult AddOrEdit(int id = 0)
        {
            var userId = GetUserId();
            if (id != 0)
            {
                var category = _context.Categories.FirstOrDefault(c => c.CategoryId == id && c.UserId == userId);
                if (category == null)
                {
                    return NotFound();
                }
                return View(category);
            }
            else
            {
                return View(new Category());
            }
        }

        // POST: Category/AddOrEdit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddOrEdit(Category category)
        {
            var userId = GetUserId();
            category.UserId = userId;
            
            // Remove UserId from ModelState validation
            ModelState.Remove("UserId");
            ModelState.Remove("User");
            
            if (ModelState.IsValid)
            {
                if (category.CategoryId == 0)
                {
                    _context.Add(category);
                }
                else
                {
                    var existing = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == category.CategoryId && c.UserId == userId);
                    if (existing == null) return NotFound();
                    existing.Title = category.Title;
                    existing.Icon = category.Icon;
                    existing.Type = category.Type;
                }
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

       

        // GET: Category/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var userId = GetUserId();
            var category = await _context.Categories
                .FirstOrDefaultAsync(m => m.CategoryId == id && m.UserId == userId);
            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // POST: Category/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var userId = GetUserId();
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id && c.UserId == userId);
            if (category != null)
            {
                _context.Categories.Remove(category);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryId == id);
        }
    }
}