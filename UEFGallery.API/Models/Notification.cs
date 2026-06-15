using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class Notification
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public NotificationType Type { get; set; }

    public string? ReferenceId { get; set; }

    public string? ReferenceType { get; set; }

    public string Content { get; set; } = string.Empty;

    public bool IsRead { get; set; }

    public string? ActorId { get; set; }

    public string? ActorName { get; set; }

    public DateTime CreatedAt { get; set; }

    public User User { get; set; }

}
