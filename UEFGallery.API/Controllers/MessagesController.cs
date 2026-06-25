using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UEFGallery.API.Data;
using UEFGallery.API.Models;
using Microsoft.AspNetCore.SignalR;
using UEFGallery.API.Hubs;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly GalleryDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext;

    public MessagesController(GalleryDbContext context, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetMessages()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var messages = await _context.Messages
            .Where(m => m.RecipientId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
    {
        if (string.IsNullOrEmpty(dto.Content) || string.IsNullOrEmpty(dto.SenderEmail))
            return BadRequest(new { error = "Thiếu thông tin bắt buộc." });

        string recipientId = dto.RecipientId ?? "";

        User? user = null;
        if (!string.IsNullOrEmpty(recipientId))
        {
            user = await _context.Users.FirstOrDefaultAsync(u => u.Id == recipientId);
        }
        else if (!string.IsNullOrEmpty(dto.RecipientSlug))
        {
            user = await _context.Users
                .Include(u => u.PortfolioSettings)
                .FirstOrDefaultAsync(u => u.StudentId == dto.RecipientSlug || 
                                          u.Email.StartsWith(dto.RecipientSlug) || 
                                          (u.PortfolioSettings != null && u.PortfolioSettings.PortfolioSlug == dto.RecipientSlug));
            
            if (user == null && dto.RecipientSlug == "uef-design-gallery")
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.Role == Role.admin);
            }

            if (user != null)
            {
                recipientId = user.Id;
            }
        }

        if (string.IsNullOrEmpty(recipientId) || user == null)
            return BadRequest(new { error = "Không tìm thấy người nhận." });

        var message = new Message
        {
            Id = Guid.NewGuid().ToString(),
            RecipientId = recipientId,
            SenderName = dto.SenderName,
            SenderEmail = dto.SenderEmail,
            SenderCompany = dto.SenderCompany,
            Purpose = dto.Purpose,
            Status = "pending",
            Content = dto.Content,
            IsRead = false,
            IsArchived = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        
        // Also create a notification for the recipient
        var notification = new Notification
        {
            Id = Guid.NewGuid().ToString(),
            UserId = recipientId,
            Type = dto.Purpose == "order" ? NotificationType.new_order : NotificationType.new_message,
            Content = dto.Purpose == "order" 
                ? $"Đơn đặt hàng mới cho tác phẩm của bạn từ {dto.SenderName}" 
                : $"Bạn có liên hệ mới từ {dto.SenderName} qua Portfolio",
            CreatedAt = DateTime.UtcNow
        };
        _context.Notifications.Add(notification);

        // If the sender is logged in, create an outbox copy and a notification for them
        var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(senderId) && senderId != recipientId)
        {
            var outboxMessage = new Message
            {
                Id = Guid.NewGuid().ToString(),
                RecipientId = senderId,
                SenderName = $"To: {user?.FullName ?? dto.RecipientSlug ?? "Unknown"}",
                SenderEmail = dto.SenderEmail,
                SenderCompany = dto.SenderCompany,
                Purpose = dto.Purpose,
                Status = "pending",
                Content = dto.Content,
                IsRead = true, // they sent it
                IsArchived = false,
                CreatedAt = DateTime.UtcNow
            };
            _context.Messages.Add(outboxMessage);

            var senderNotification = new Notification
            {
                Id = Guid.NewGuid().ToString(),
                UserId = senderId,
                Type = dto.Purpose == "order" ? NotificationType.new_order : NotificationType.new_message,
                Content = dto.Purpose == "order" 
                    ? $"Đơn đặt hàng của bạn đã được gửi thành công đến {(user?.FullName ?? dto.RecipientSlug ?? "tác giả")}."
                    : dto.Purpose == "feedback" 
                        ? $"Feedback kín của bạn đã được gửi thành công đến {(user?.FullName ?? dto.RecipientSlug ?? "sinh viên")}."
                        : $"Tin nhắn của bạn đã được gửi thành công đến {(user?.FullName ?? dto.RecipientSlug ?? "người nhận")}.",
                CreatedAt = DateTime.UtcNow
            };
            _context.Notifications.Add(senderNotification);
        }

        await _context.SaveChangesAsync();

        await _hubContext.Clients.Group(recipientId).SendAsync("ReceiveMessage", message);

        return Ok(message);
    }

    [HttpPut("{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == id && m.RecipientId == userId);

        if (message == null) return NotFound();

        message.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpPatch("{id}/archive")]
    [Authorize]
    public async Task<IActionResult> ArchiveMessage(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == id && m.RecipientId == userId);

        if (message == null) return NotFound();

        message.IsArchived = true;
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpPatch("{id}/unarchive")]
    [Authorize]
    public async Task<IActionResult> UnarchiveMessage(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == id && m.RecipientId == userId);

        if (message == null) return NotFound();

        message.IsArchived = false;
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpPatch("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateMessageStatusDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == id && m.RecipientId == userId);

        if (message == null) return NotFound();

        message.Status = dto.Status;
        await _context.SaveChangesAsync();

        return Ok(new { success = true, status = message.Status });
    }
}

public class UpdateMessageStatusDto
{
    public required string Status { get; set; }
}

public class SendMessageDto
{
    public string? RecipientId { get; set; }
    public string? RecipientSlug { get; set; }
    public required string SenderName { get; set; }
    public required string SenderEmail { get; set; }
    public string? SenderCompany { get; set; }
    public string? Purpose { get; set; }
    public required string Content { get; set; }
}
