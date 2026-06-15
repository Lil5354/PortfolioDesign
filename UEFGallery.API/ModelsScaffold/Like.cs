using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class Like
{
    public string LikeId { get; set; } = null!;

    public string ArtworkId { get; set; } = null!;

    public string? UserId { get; set; }

    public string? IpAddress { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Artwork Artwork { get; set; } = null!;

    public virtual User? User { get; set; }
}
