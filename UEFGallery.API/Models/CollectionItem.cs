using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class CollectionItem
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string LecturerId { get; set; } = string.Empty;

    public string ArtworkId { get; set; } = string.Empty;

    public string? CollectionName { get; set; }

    public string? CuratorEssay { get; set; }

    public string? Theme { get; set; }

    public string? Note { get; set; }

    public DateTime AddedAt { get; set; }

    public User Lecturer { get; set; }

    public Artwork Artwork { get; set; }

}
