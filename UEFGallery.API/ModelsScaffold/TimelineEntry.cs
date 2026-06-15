using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class TimelineEntry
{
    public string EntryId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string Month { get; set; } = null!;

    public string Year { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public List<string>? Tags { get; set; }

    public string? LinkUrl { get; set; }

    public string? LinkLabel { get; set; }

    public string? ImageUrl { get; set; }

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
