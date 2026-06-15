using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class Comment
{
    public string CommentId { get; set; } = null!;

    public string ArtworkId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Artwork Artwork { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
