using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public AdminController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var usersCount = await _context.Users.CountAsync();
        var artworksCount = await _context.Artworks.CountAsync();
        var viewsCount = await _context.Artworks.SumAsync(a => a.ViewCount);
        var likesCount = await _context.Likes.CountAsync();

        return Ok(new
        {
            TotalUsers = usersCount,
            TotalArtworks = artworksCount,
            TotalViews = viewsCount,
            TotalLikes = likesCount
        });
    }

    [HttpGet("artworks")]
    public async Task<IActionResult> GetArtworks([FromQuery] int page = 1)
    {
        var limit = 20;
        var skip = (page - 1) * limit;

        var query = _context.Artworks.Include(a => a.User);
        
        var total = await query.CountAsync();
        var artworks = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip(skip)
            .Take(limit)
            .ToListAsync();

        return Ok(new
        {
            artworks,
            total,
            page,
            totalPages = (int)Math.Ceiling(total / (double)limit)
        });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1)
    {
        var limit = 20;
        var skip = (page - 1) * limit;

        var query = _context.Users;
        
        var total = await query.CountAsync();
        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip(skip)
            .Take(limit)
            .ToListAsync();

        return Ok(new
        {
            users,
            total,
            page,
            totalPages = (int)Math.Ceiling(total / (double)limit)
        });
    }

    [HttpPatch("users/{id}/lock")]
    public async Task<IActionResult> LockUser(string id, [FromBody] LockUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsActive = dto.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { success = true, isActive = user.IsActive });
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpPatch("artworks/{id}/status")]
    public async Task<IActionResult> SetArtworkStatus(string id, [FromBody] SetArtworkStatusDto dto)
    {
        var artwork = await _context.Artworks.FindAsync(id);
        if (artwork == null) return NotFound();

        artwork.IsPublic = dto.IsPublic;
        if (dto.IsPublic)
        {
            artwork.IsPending = false;
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPatch("artworks/{id}/highlight")]
    public async Task<IActionResult> ToggleArtworkHighlight(string id, [FromBody] ToggleHighlightDto dto)
    {
        var artwork = await _context.Artworks.FindAsync(id);
        if (artwork == null) return NotFound();

        artwork.IsHighlighted = dto.IsHighlighted;
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpDelete("artworks/{id}")]
    public async Task<IActionResult> DeleteArtwork(string id)
    {
        var artwork = await _context.Artworks.FindAsync(id);
        if (artwork == null) return NotFound();

        _context.Artworks.Remove(artwork);
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }
}

public class LockUserDto
{
    public bool IsActive { get; set; }
}

public class SetArtworkStatusDto
{
    public bool IsPublic { get; set; }
}

public class ToggleHighlightDto
{
    public bool IsHighlighted { get; set; }
}
