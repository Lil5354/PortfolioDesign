using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class Notification
{
    public string NotificationId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string? ReferenceId { get; set; }

    public string? ReferenceType { get; set; }

    public string Content { get; set; } = null!;

    public bool IsRead { get; set; }

    public string? ActorId { get; set; }

    public string? ActorName { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
