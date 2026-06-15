using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class SiteSetting
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string Key { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

}
