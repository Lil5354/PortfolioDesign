using System;
using System.ComponentModel.DataAnnotations;

namespace UEFGallery.API.Models
{
    public class UserAccountBadge
    {
        public string UserId { get; set; } = string.Empty;
        public User? User { get; set; }

        public Guid AccountBadgeId { get; set; }
        public AccountBadge? AccountBadge { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
