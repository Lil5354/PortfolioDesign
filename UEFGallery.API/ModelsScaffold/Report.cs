using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class Report
{
    public string ReportId { get; set; } = null!;

    public string ArtworkId { get; set; } = null!;

    public string? UserId { get; set; }

    public string ViolationType { get; set; } = null!;

    public string? Detail { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Artwork Artwork { get; set; } = null!;

    public virtual User? User { get; set; }
}
