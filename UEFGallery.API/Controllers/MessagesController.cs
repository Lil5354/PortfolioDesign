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
            .Select(m => new {
                id = m.Id,
                recipientId = m.RecipientId,
                recipientSlug = "",
                  senderName = m.SenderName.StartsWith("To: ") 
                               ? "To: " + (_context.Users.Where(u => u.Email == m.SenderEmail).Select(u => u.FullName).FirstOrDefault() ?? m.SenderName.Replace("To: ", "").Trim())
                               : (_context.Users.Where(u => u.Email == m.SenderEmail).Select(u => u.FullName).FirstOrDefault() ?? m.SenderName),
                senderEmail = m.SenderEmail,
                senderCompany = m.SenderCompany,
                purpose = m.Purpose,
                status = m.Status,
                content = m.Content,
                isRead = m.IsRead,
                isEmailed = m.IsEmailed,
                isArchived = m.IsArchived,
                createdAt = m.CreatedAt,
                senderAvatarUrl = _context.Users.Where(u => u.Email == m.SenderEmail).Select(u => u.AvatarUrl).FirstOrDefault(),
                recipientAvatarUrl = _context.Users.Where(u => u.Id == m.RecipientId).Select(u => u.AvatarUrl).FirstOrDefault()
            })
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
        
        // If the sender is logged in, create an outbox copy
        var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(senderId) && senderId != recipientId)
        {
            var outboxMessage = new Message
            {
                Id = Guid.NewGuid().ToString(),
                RecipientId = senderId,
                SenderName = $"To: {user?.FullName ?? dto.RecipientSlug ?? "người nhận"}",
                SenderEmail = user?.Email ?? dto.RecipientSlug ?? "",
                SenderCompany = dto.SenderCompany,
                Purpose = dto.Purpose,
                Content = dto.Content,
                IsRead = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.Messages.Add(outboxMessage);
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
