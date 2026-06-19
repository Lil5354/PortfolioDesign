using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class Follow
{
    [Required]
    public string FollowerId { get; set; } = string.Empty;

    public User Follower { get; set; } = null!;

    [Required]
    public string FollowedId { get; set; } = string.Empty;

    public User Followed { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
