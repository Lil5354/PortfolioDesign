using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class User
{
    public string UserId { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? StudentId { get; set; }

    public string? AvatarUrl { get; set; }

    public string? Bio { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? Major { get; set; }

    public string? Cohort { get; set; }

    public string? Department { get; set; }

    public List<string>? ManagedClasses { get; set; }

    public string? Title { get; set; }

    public string? Company { get; set; }

    public string? Position { get; set; }

    public string? Industry { get; set; }

    public bool IsActive { get; set; }

    public DateTime? EmailVerified { get; set; }

    public string? VerificationCode { get; set; }

    public DateTime? VerificationCodeExpires { get; set; }

    public string? ResetCode { get; set; }

    public DateTime? ResetCodeExpires { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Artwork> Artworks { get; set; } = new List<Artwork>();

    public virtual ICollection<CollectionItem> CollectionItems { get; set; } = new List<CollectionItem>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Grade> Grades { get; set; } = new List<Grade>();

    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual PortfolioSetting? PortfolioSetting { get; set; }

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual ICollection<TimelineEntry> TimelineEntries { get; set; } = new List<TimelineEntry>();
}
