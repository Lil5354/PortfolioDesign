using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimelineController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public TimelineController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetMyTimeline()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var timeline = await _context.TimelineEntrys
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Year)
            .ToListAsync();

        return Ok(timeline);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateEntry([FromBody] TimelineEntryDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var entry = new TimelineEntry
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            Title = dto.Title,
            Description = dto.Description,
            Year = dto.Year,
            Month = dto.Month ?? "",
            Tags = dto.Tags ?? new List<string>(),
            LinkUrl = dto.LinkUrl,
            LinkLabel = dto.LinkLabel,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.TimelineEntrys.Add(entry);
        await _context.SaveChangesAsync();

        return Ok(entry);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateEntry(string id, [FromBody] TimelineEntryDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var entry = await _context.TimelineEntrys.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (entry == null) return NotFound();

        entry.Title = dto.Title;
        entry.Description = dto.Description;
        entry.Year = dto.Year;
        entry.Month = dto.Month ?? "";
        entry.Tags = dto.Tags ?? new List<string>();
        entry.LinkUrl = dto.LinkUrl;
        entry.LinkLabel = dto.LinkLabel;
        entry.ImageUrl = dto.ImageUrl;
        entry.UpdatedAt = DateTime.UtcNow;

        // Ensure CreatedAt is UTC to avoid Npgsql Unspecified kind exception
        if (entry.CreatedAt.Kind == DateTimeKind.Unspecified)
        {
            entry.CreatedAt = DateTime.SpecifyKind(entry.CreatedAt, DateTimeKind.Utc);
        }

        _context.TimelineEntrys.Update(entry);
        await _context.SaveChangesAsync();

        return Ok(entry);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteEntry(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var entry = await _context.TimelineEntrys.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (entry == null) return NotFound();

        _context.TimelineEntrys.Remove(entry);
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }
}

public class TimelineEntryDto
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public string Year { get; set; } = string.Empty;
    public string? Month { get; set; }
    public List<string>? Tags { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkLabel { get; set; }
    public string? ImageUrl { get; set; }
}
