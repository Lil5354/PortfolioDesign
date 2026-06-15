using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class SiteSectionItem
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string SectionId { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public string Content { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public SiteSection Section { get; set; }

}
