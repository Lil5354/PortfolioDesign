using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class PortfolioSetting
{
    public string SettingId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string? PortfolioSlug { get; set; }

    public bool IsPortfolioPublic { get; set; }

    public bool ShowEmail { get; set; }

    public string? ProfileHeadline { get; set; }

    public string? SocialLinks { get; set; }

    public bool ContactEnabled { get; set; }

    public string? Major { get; set; }

    public string? YearLevel { get; set; }

    public List<string>? FeaturedArtworkIds { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
