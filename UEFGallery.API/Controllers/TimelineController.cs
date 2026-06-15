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
            Month = "",
            Tags = new List<string>(),
            CreatedAt = DateTime.UtcNow
        };

        _context.TimelineEntrys.Add(entry);
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
}
