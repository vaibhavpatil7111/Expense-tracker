using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker.Models
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CategoryId { get; set; }

        [Required]
        [Column (TypeName = "nvarchar(50)")]
        public string Title { get; set; } = "";

        [Column(TypeName = "nvarchar(50)")]
        public string Icon { get; set; } = "";
        
        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public string Type { get; set; } = "Expense";

        [Required]
        public string UserId { get; set; } = "";
        
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }
    }
}