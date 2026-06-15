using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class SiteSetting
{
    public string SettingId { get; set; } = null!;

    public string Key { get; set; } = null!;

    public string Value { get; set; } = null!;

    public string Type { get; set; } = null!;
}
