using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class PortfolioSetting
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public string? PortfolioSlug { get; set; }

    public bool IsPortfolioPublic { get; set; }

    public bool ShowEmail { get; set; }

    public string? ProfileHeadline { get; set; }

    public string? BannerUrl { get; set; }

    public string? SocialLinks { get; set; }

    public bool ContactEnabled { get; set; }

    public string DisplayOrder { get; set; } = "newest";

    public string? Major { get; set; }

    public string? YearLevel { get; set; }

    public List<string>? FeaturedArtworkIds { get; set; }

    public List<string>? PublicMoodboards { get; set; }

    public DateTime UpdatedAt { get; set; }

    public User User { get; set; }

}
