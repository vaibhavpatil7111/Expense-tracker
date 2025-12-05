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

        [Column (TypeName = "nvarchar(50)")]
        public string? Title { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Icon { get; set; } = "";
        [Column(TypeName = "nvarchar(50)")]
        public string Type { get; set; } = "Expense";

        // [NotMapped]
        // public string? TitleIcon
        // {
        //     get
        //     {
        //         return this.Icon + " " + this.Title;
        //     }
        // }

    }
}