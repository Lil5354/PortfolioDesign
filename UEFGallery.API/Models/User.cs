using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class User
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string? StudentId { get; set; }

    public Role Role { get; set; }

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

    public ICollection<Artwork> Artworks { get; set; } = new List<Artwork>();

    public ICollection<Grade> GradesGiven { get; set; } = new List<Grade>();

    public ICollection<Like> Likes { get; set; } = new List<Like>();

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public ICollection<Report> Reports { get; set; } = new List<Report>();

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public ICollection<Message> Messages { get; set; } = new List<Message>();

    public PortfolioSetting? PortfolioSettings { get; set; }

    public ICollection<TimelineEntry> TimelineEntries { get; set; } = new List<TimelineEntry>();

    public ICollection<CollectionItem> Collections { get; set; } = new List<CollectionItem>();

    public ICollection<Follow> Followers { get; set; } = new List<Follow>();

    public ICollection<Follow> Following { get; set; } = new List<Follow>();

}
