using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public UsersController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _context.Users
            .Include(u => u.PortfolioSettings)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound();

        return Ok(new
        {
            user.Id,
            user.Email,
            user.FullName,
            user.StudentId,
            user.Role,
            user.AvatarUrl,
            user.Bio,
            user.Major,
            user.Cohort,
            user.PortfolioSettings
        });
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchUsers([FromQuery] string q)
    {
        if (string.IsNullOrEmpty(q)) return Ok(new List<object>());

        var searchLower = q.ToLower();
        var users = await _context.Users
            .Where(u => u.FullName.ToLower().Contains(searchLower) || (u.Email.ToLower().Contains(searchLower)))
            .Select(u => new { u.Id, u.FullName, u.AvatarUrl, u.Email, PortfolioSettings = u.PortfolioSettings })
            .Take(10)
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("me/artworks")]
    [Authorize]
    public async Task<IActionResult> GetMyArtworks()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var artworks = await _context.Artworks
            .Where(a => a.UserId == userId || a.CollaboratorIds.Contains(userId))
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.CoverImageUrl,
                a.Subject,
                a.IsPublic,
                a.LikeCount,
                a.ViewCount,
                a.CreatedAt
            })
            .ToListAsync();

        return Ok(artworks);
    }

    [HttpGet("me/stats")]
    [Authorize]
    public async Task<IActionResult> GetMyStats()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var myArtworks = await _context.Artworks
            .Where(a => a.UserId == userId)
            .ToListAsync();

        return Ok(new
        {
            totalArtworks = myArtworks.Count,
            totalViews = myArtworks.Sum(a => a.ViewCount),
            totalLikes = myArtworks.Sum(a => a.LikeCount),
            publicArtworks = myArtworks.Count(a => a.IsPublic)
        });
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        user.FullName = dto.FullName ?? user.FullName;
        user.Bio = dto.Bio ?? user.Bio;
        user.AvatarUrl = dto.AvatarUrl ?? user.AvatarUrl;
        user.Major = dto.Major ?? user.Major;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật hồ sơ thành công." });
    }
    [HttpPut("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        bool isPasswordValid = false;
        try
        {
            if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);
                if (!isPasswordValid && user.PasswordHash == dto.CurrentPassword)
                {
                    isPasswordValid = true;
                }
            }
        }
        catch
        {
            if (user.PasswordHash == dto.CurrentPassword)
            {
                isPasswordValid = true;
            }
        }

        if (!isPasswordValid)
        {
            return BadRequest(new { error = "Mật khẩu hiện tại không chính xác." });
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Đổi mật khẩu thành công." });
    }
    [HttpPost("{id}/follow")]
    [Authorize]
    public async Task<IActionResult> FollowUser(string id)
    {
        var followerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (followerId == null || followerId == id) return BadRequest(new { error = "Invalid action." });

        var targetUser = await _context.Users.FindAsync(id);
        if (targetUser == null) return NotFound(new { error = "User not found." });

        var exists = await _context.Follows.AnyAsync(f => f.FollowerId == followerId && f.FollowedId == id);
        if (!exists)
        {
            _context.Follows.Add(new Follow { FollowerId = followerId, FollowedId = id });
            await _context.SaveChangesAsync();
        }

        return Ok(new { success = true });
    }

    [HttpDelete("{id}/follow")]
    [Authorize]
    public async Task<IActionResult> UnfollowUser(string id)
    {
        var followerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (followerId == null) return BadRequest();

        var follow = await _context.Follows.FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowedId == id);
        if (follow != null)
        {
            _context.Follows.Remove(follow);
            await _context.SaveChangesAsync();
        }

        return Ok(new { success = true });
    }

    [HttpGet("{id}/followers")]
    public async Task<IActionResult> GetFollowers(string id)
    {
        var followerIds = await _context.Follows.Where(f => f.FollowedId == id).Select(f => f.FollowerId).ToListAsync();
        var followers = await _context.Users.Where(u => followerIds.Contains(u.Id)).Select(u => new { u.Id, u.FullName, u.AvatarUrl, u.Major }).ToListAsync();
        return Ok(followers);
    }

    [HttpGet("{id}/following")]
    public async Task<IActionResult> GetFollowing(string id)
    {
        var followedIds = await _context.Follows.Where(f => f.FollowerId == id).Select(f => f.FollowedId).ToListAsync();
        var following = await _context.Users.Where(u => followedIds.Contains(u.Id)).Select(u => new { u.Id, u.FullName, u.AvatarUrl, u.Major }).ToListAsync();
        return Ok(following);
    }
}

public class UpdateProfileDto
{
    public string? FullName { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Major { get; set; }
}

public class ChangePasswordDto
{
    public required string CurrentPassword { get; set; }
    public required string NewPassword { get; set; }
}
