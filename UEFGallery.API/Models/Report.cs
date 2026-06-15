using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class Report
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string ArtworkId { get; set; } = string.Empty;

    public string? UserId { get; set; }

    public string ViolationType { get; set; } = string.Empty;

    public string? Detail { get; set; }

    public ReportStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Artwork Artwork { get; set; }

    public User? User { get; set; }

}
