using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class Grade
{
    public string GradeId { get; set; } = null!;

    public string ArtworkId { get; set; } = null!;

    public string LecturerId { get; set; } = null!;

    public decimal? Score { get; set; }

    public string? Comment { get; set; }

    public bool IsVisibleToStudent { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Artwork Artwork { get; set; } = null!;

    public virtual User Lecturer { get; set; } = null!;
}
