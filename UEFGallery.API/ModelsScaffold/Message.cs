using System;
using System.Collections.Generic;

namespace UEFGallery.API.ModelsScaffold;

public partial class Message
{
    public string MessageId { get; set; } = null!;

    public string RecipientId { get; set; } = null!;

    public string SenderName { get; set; } = null!;

    public string SenderEmail { get; set; } = null!;

    public string? SenderCompany { get; set; }

    public string? Purpose { get; set; }

    public string Content { get; set; } = null!;

    public bool IsRead { get; set; }

    public bool IsEmailed { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsArchived { get; set; }

    public virtual User Recipient { get; set; } = null!;
}
