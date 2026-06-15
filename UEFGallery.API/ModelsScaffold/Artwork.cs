using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class Artwork
{
    public string ArtworkId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public List<string>? ToolsUsed { get; set; }

    public string? Subject { get; set; }

    public string? Semester { get; set; }

    public string? AcademicYear { get; set; }

    public List<string>? Tags { get; set; }

    public List<string>? Collaborators { get; set; }

    public List<string>? CollaboratorIds { get; set; }

    public string CoverImageUrl { get; set; } = null!;

    public string? WatermarkImageUrl { get; set; }

    public List<string>? FileUrls { get; set; }

    public string? WatermarkText { get; set; }

    public string? WatermarkPosition { get; set; }

    public bool IsPublic { get; set; }

    public bool IsPending { get; set; }

    public bool IsHighlighted { get; set; }

    public bool IsAiConfirmed { get; set; }

    public int ViewCount { get; set; }

    public int LikeCount { get; set; }

    public string? PortfolioSlug { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<CollectionItem> CollectionItems { get; set; } = new List<CollectionItem>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Grade> Grades { get; set; } = new List<Grade>();

    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual User User { get; set; } = null!;
}
