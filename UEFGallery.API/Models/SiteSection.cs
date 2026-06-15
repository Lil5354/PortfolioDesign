using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class SiteSection
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string Page { get; set; } = string.Empty;

    public string Section { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<SiteSectionItem> Items { get; set; } = new List<SiteSectionItem>();

}
