using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class Comment
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string ArtworkId { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Artwork Artwork { get; set; }

    public User User { get; set; }

}
