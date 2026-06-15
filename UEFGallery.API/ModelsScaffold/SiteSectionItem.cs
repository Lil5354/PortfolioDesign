using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class SiteSectionItem
{
    public string ItemId { get; set; } = null!;

    public string SectionId { get; set; } = null!;

    public int SortOrder { get; set; }

    public string Content { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual SiteSection Section { get; set; } = null!;
}
