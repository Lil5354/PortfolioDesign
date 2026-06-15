using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class SiteSection
{
    public string SectionId { get; set; } = null!;

    public string Page { get; set; } = null!;

    public string Section { get; set; } = null!;

    public string Label { get; set; } = null!;

    public int SortOrder { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<SiteSectionItem> SiteSectionItems { get; set; } = new List<SiteSectionItem>();
}
