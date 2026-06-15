using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class Grade
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string ArtworkId { get; set; } = string.Empty;

    public string LecturerId { get; set; } = string.Empty;

    public decimal? Score { get; set; }

    public string? Comment { get; set; }

    public bool IsVisibleToStudent { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Artwork Artwork { get; set; }

    public User Lecturer { get; set; }

}
