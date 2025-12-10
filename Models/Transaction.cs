using System.ComponentModel.DataAnnotations;
using System;
using System.ComponentModel.DataAnnotations.Schema;
namespace ExpenseTracker.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        [Required]
        public int Amount { get; set; }

        [Column(TypeName = "nvarchar(250)")]
        public string? Note { get; set; }
        
        [Required]
        public DateTime Date { get; set; } = DateTime.Now;

        [Required]
        public string UserId { get; set; } = "";
        
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
    }
}