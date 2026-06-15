using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class CollectionItem
{
    public string CollectionItemId { get; set; } = null!;

    public string LecturerId { get; set; } = null!;

    public string ArtworkId { get; set; } = null!;

    public string? CollectionName { get; set; }

    public string? CuratorEssay { get; set; }

    public string? Theme { get; set; }

    public string? Note { get; set; }

    public DateTime AddedAt { get; set; }

    public virtual Artwork Artwork { get; set; } = null!;

    public virtual User Lecturer { get; set; } = null!;
}
