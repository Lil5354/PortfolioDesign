using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UEFGallery.API.Models
{
    public class AccountBadge
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = string.Empty;

        public string IconUrl { get; set; } = string.Empty;
        
        public string TextColor { get; set; } = "#FFFFFF";
        
        public string BgColor { get; set; } = "#1A4BA8";
        
        public string Tooltip { get; set; } = string.Empty;

        // "Default" (auto-assigned by logic) or "Custom" (manually assigned by Admin)
        public string Type { get; set; } = "Custom"; 

        // For default badges, e.g., "Year1", "Lecturer"
        public string? Condition { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<UserAccountBadge> UserAccountBadges { get; set; } = new List<UserAccountBadge>();
    }
}
