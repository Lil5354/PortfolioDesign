using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

[Table("timeline_entries")]
public class TimelineEntry
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public string Month { get; set; } = string.Empty;

    public string Year { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public List<string>? Tags { get; set; }

    public string? LinkUrl { get; set; }

    public string? LinkLabel { get; set; }

    public string? ImageUrl { get; set; }

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public User User { get; set; }

}
