using System;

namespace UEFGallery.API.Models
{
    public class ArtworkBadge
    {
        public string ArtworkId { get; set; } = string.Empty;
        public Artwork? Artwork { get; set; }

        public Guid BadgeId { get; set; }
        public Badge? Badge { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
