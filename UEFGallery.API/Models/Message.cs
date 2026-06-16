using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UEFGallery.API.Models;

public class Message
{
    [Key]
    public string Id { get; set; } = string.Empty;

    public string RecipientId { get; set; } = string.Empty;

    public string SenderName { get; set; } = string.Empty;

    public string SenderEmail { get; set; } = string.Empty;

    public string? SenderCompany { get; set; }

    public string? Purpose { get; set; }

    public string? Status { get; set; } // pending, processing, completed

    public string Content { get; set; } = string.Empty;

    public bool IsRead { get; set; }

    public bool IsEmailed { get; set; }

    public bool IsArchived { get; set; }

    public DateTime CreatedAt { get; set; }

    public User Recipient { get; set; }

}
