using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin,lecturer")]
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
        var totalAccounts = await _context.Users.CountAsync();
        var publishedArtworks = await _context.Artworks.CountAsync(a => a.IsPublic && !a.IsPending);
        var reportedArtworks = await _context.Artworks.CountAsync(a => a.Reports.Any());
        var pendingArtworks = await _context.Artworks.CountAsync(a => a.IsPending);
        var likesCount = await _context.Likes.CountAsync();
        var commentsCount = await _context.Comments.CountAsync();

        return Ok(new
        {
            PublishedArtworks = publishedArtworks,
            ReportedArtworks = reportedArtworks,
            PendingArtworks = pendingArtworks,
            TotalAccounts = totalAccounts,
            TotalInteractions = likesCount + commentsCount
        });
    }

    [HttpGet("artworks")]
    public async Task<IActionResult> GetArtworks([FromQuery] int page = 1, [FromQuery] int limit = 20, [FromQuery] string? q = null, [FromQuery] string? tab = "all", [FromQuery] string? subject = "Tất cả", [FromQuery] string? year = "Tất cả")
    {
        var skip = (page - 1) * limit;

        var query = _context.Artworks.Include(a => a.User).Include(a => a.Reports).AsQueryable();

        if (!string.IsNullOrEmpty(q))
        {
            var qLower = q.ToLower();
            query = query.Where(a => a.Title.ToLower().Contains(qLower) || (a.User != null && a.User.FullName.ToLower().Contains(qLower)));
        }

        if (subject != "Tất cả" && !string.IsNullOrEmpty(subject))
        {
            query = query.Where(a => a.Subject == subject);
        }

        if (year != "Tất cả" && !string.IsNullOrEmpty(year))
        {
            query = query.Where(a => a.AcademicYear == year);
        }

        var allCount = await query.CountAsync();
        var pendingCount = await query.CountAsync(a => a.IsPending);
        var hiddenCount = await query.CountAsync(a => !a.IsPublic && !a.IsPending);
        var highlightCount = await query.CountAsync(a => a.IsHighlighted);
        var reportedCount = await query.CountAsync(a => a.Reports.Any());

        if (tab == "pending") query = query.Where(a => a.IsPending);
        else if (tab == "hidden") query = query.Where(a => !a.IsPublic && !a.IsPending);
        else if (tab == "highlight") query = query.Where(a => a.IsHighlighted);
        else if (tab == "reported") query = query.Where(a => a.Reports.Any());

        var total = await query.CountAsync();
        
        var artworksWithCount = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip(skip)
            .Take(limit)
            .Select(a => new {
                a.Id, a.Title, a.Description, a.UserId, a.IsPublic, a.IsPending, a.IsHighlighted, a.CreatedAt, a.UpdatedAt, a.CoverImageUrl, a.FileUrls, a.Subject, a.AcademicYear, a.ToolsUsed,
                User = new {
                    Id = a.User.Id,
                    FullName = a.User.FullName,
                    Email = a.User.Email,
                    AvatarUrl = a.User.AvatarUrl
                },
                _count = new { reports = a.Reports.Count() }
            })
            .ToListAsync();

        return Ok(new
        {
            artworks = artworksWithCount,
            total,
            page,
            limit,
            totalPages = (int)Math.Ceiling(total / (double)limit),
            counts = new { all = allCount, pending = pendingCount, hidden = hiddenCount, highlight = highlightCount, reported = reportedCount }
        });
    }

    [HttpGet("test-reports")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTestReports()
    {
        var reports = await _context.Reports.ToListAsync();
        return Ok(reports);
    }


    [HttpGet("users")]
    [Authorize(Roles = "admin")]
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

        foreach (var user in users)
        {
            if (user.AvatarUrl != null && user.AvatarUrl.Length > 1000)
            {
                user.AvatarUrl = null;
            }
        }

        return Ok(new
        {
            users,
            total,
            page,
            totalPages = (int)Math.Ceiling(total / (double)limit)
        });
    }

    [HttpPatch("users/{id}/lock")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> LockUser(string id, [FromBody] LockUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsActive = dto.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { success = true, isActive = user.IsActive });
    }

    [HttpDelete("users/{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpPatch("users/{id}/role")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateUserRole(string id, [FromBody] UpdateUserRoleDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        if (Enum.TryParse<Role>(dto.Role, true, out var role))
        {
            user.Role = role;
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
        return BadRequest("Invalid role");
    }

    [HttpPut("users/{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.FullName = dto.FullName ?? user.FullName;
        user.Email = dto.Email ?? user.Email;
        user.StudentId = dto.StudentId ?? user.StudentId;
        user.Phone = dto.Phone ?? user.Phone;
        user.Address = dto.Address ?? user.Address;
        user.Major = dto.Major ?? user.Major;
        user.Cohort = dto.Cohort ?? user.Cohort;
        user.Bio = dto.Bio ?? user.Bio;
        
        if (!string.IsNullOrEmpty(dto.Role) && Enum.TryParse<Role>(dto.Role, true, out var role))
        {
            user.Role = role;
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPost("users/bulk")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> BulkImportUsers([FromBody] List<ImportUserDto> dtos)
    {
        var users = new List<User>();
        foreach (var dto in dtos)
        {
            if (!Enum.TryParse<Role>(dto.Role, true, out var role))
            {
                role = Role.student;
            }

            users.Add(new User
            {
                Id = Guid.NewGuid().ToString(),
                FullName = dto.FullName,
                Email = dto.Email,
                Role = role,
                StudentId = dto.StudentId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            });
        }
        
        _context.Users.AddRange(users);
        await _context.SaveChangesAsync();
        return Ok(new { success = true, count = users.Count });
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

public class UpdateUserRoleDto
{
    public string Role { get; set; } = string.Empty;
}

public class UpdateUserDto
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? StudentId { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Major { get; set; }
    public string? Cohort { get; set; }
    public string? Bio { get; set; }
    public string? Role { get; set; }
}

public class ImportUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? StudentId { get; set; }
}
