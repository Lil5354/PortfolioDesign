using System;
using System.Collections.Generic;

namespace UEFGallery.API.Models
{
    public class Badge
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string ColorCode { get; set; } = "#1A4BA8"; // Default CERULEAN
        public string TextColor { get; set; } = "#FFFFFF";
        
        public string LecturerId { get; set; } = string.Empty; // The user who created this badge
        public User? Lecturer { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<ArtworkBadge> ArtworkBadges { get; set; } = new List<ArtworkBadge>();
    }
}
