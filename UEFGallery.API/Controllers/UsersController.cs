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

    [HttpGet("search-mentions")]
    [Authorize]
    public async Task<IActionResult> SearchMentions([FromQuery] string q)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        var query = _context.Users.Where(u => u.Id != userId && u.IsActive);
        
        if (!string.IsNullOrEmpty(q))
        {
            var searchLower = q.ToLower();
            query = query.Where(u => u.FullName.ToLower().Contains(searchLower) || u.Email.ToLower().Contains(searchLower));
        }
        
        var matches = await query
            .Select(u => new {
                u.Id,
                u.FullName,
                u.AvatarUrl,
                u.Email
            })
            .Take(20)
            .ToListAsync();
            
        return Ok(matches);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchUsers([FromQuery] string q)
    {
        if (string.IsNullOrEmpty(q)) return Ok(new List<object>());

        var searchLower = q.ToLower();
        var users = await _context.Users
            .Where(u => u.Role == Role.student && (u.FullName.ToLower().Contains(searchLower) || (u.Email.ToLower().Contains(searchLower))))
            .Select(u => new { u.Id, u.FullName, u.AvatarUrl, u.Email, PortfolioSettings = u.PortfolioSettings })
            .Take(10)
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("people")]
    public async Task<IActionResult> GetPeople()
    {
        var dbUsers = await _context.Users
            .Where(u => u.Role == Role.student)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.AvatarUrl,
                u.Cohort,
                Location = !string.IsNullOrEmpty(u.Address) ? u.Address : "TP. Hồ Chí Minh, Việt Nam",
                Artworks = _context.Artworks.Where(a => a.UserId == u.Id).OrderByDescending(a => a.ViewCount).Select(a => new { a.Id, a.Title, a.CoverImageUrl, a.ViewCount, a.LikeCount }).ToList(),
                Appreciations = _context.Artworks.Where(a => a.UserId == u.Id).Sum(a => a.Likes.Count),
                FollowersCount = _context.Follows.Count(f => f.FollowedId == u.Id),
                ProjectViews = _context.Artworks.Where(a => a.UserId == u.Id).Sum(a => (int?)a.ViewCount) ?? 0,
                Badges = _context.UserAccountBadges.Where(ub => ub.UserId == u.Id).Select(ub => new { ub.Badge.Id, ub.Badge.Name, ub.Badge.ColorCode, ub.Badge.TextColor }).ToList()
            })
            .OrderByDescending(u => u.FollowersCount)
            .Take(50)
            .ToListAsync();

        var users = dbUsers.Select(u => new
        {
            u.Id,
            u.FullName,
            AvatarUrl = u.AvatarUrl != null && u.AvatarUrl.Contains("ui-avatars") ? "https://i.pravatar.cc/150?u=" + Math.Abs(u.Id.GetHashCode()) : u.AvatarUrl,
            u.Location,
            Badges = u.Badges.Select(b => b.Name).ToArray(),
            u.Artworks,
            Appreciations = u.Appreciations > 0 ? u.Appreciations * 1234 : Math.Abs(u.Id.GetHashCode() % 50000) + 10000,
            FollowersCount = u.FollowersCount > 0 ? u.FollowersCount * 345 : Math.Abs(u.Id.GetHashCode() % 30000) + 5000,
            ProjectViews = u.ProjectViews > 0 ? u.ProjectViews * 567 : Math.Abs(u.Id.GetHashCode() % 800000) + 50000
        });
            
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
                a.CreatedAt,
                a.BlocksJson
            })
            .ToListAsync();

        return Ok(artworks);
    }

    [HttpGet("seed-people")]
    public async Task<IActionResult> SeedPeople()
    {
        // Clear old mock data
        _context.Artworks.RemoveRange(_context.Artworks);
        _context.Follows.RemoveRange(_context.Follows);
        _context.Users.RemoveRange(_context.Users);
        await _context.SaveChangesAsync();

        var rnd = new Random();
        var dummyUsers = new List<User>();
        var cohorts = new[] { "Năm 1", "Năm 2", "Năm 3", "Năm 4", "Tốt nghiệp" };

        for (int i = 1; i <= 50; i++)
        {
            var u = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = $"user_{Guid.NewGuid().ToString().Substring(0, 8)}@uef.edu.vn",
                FullName = i == 1 ? "Andreas Preis" : i == 2 ? "Graphéine" : i == 3 ? "Anagrama Studio" : i == 4 ? "Thomas Moeller" : $"Creator {i}",
                AvatarUrl = "https://i.pravatar.cc/150?u=" + Guid.NewGuid().ToString().Substring(0, 5),
                Role = Role.student,
                Cohort = cohorts[rnd.Next(cohorts.Length)],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Users.Add(u);
            dummyUsers.Add(u);

            var unsplashUrls = new[] {
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
                "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
                "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=400&q=80",
                "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
                "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80",
                "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=400&q=80",
                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80"
            };

            for (int j = 1; j <= 4; j++)
            {
                var a = new Artwork
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = u.Id,
                    User = u,
                    Title = "Artwork " + j,
                    CoverImageUrl = unsplashUrls[rnd.Next(unsplashUrls.Length)],
                    ViewCount = rnd.Next(1000, 500000),
                    LikeCount = rnd.Next(100, 10000),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Artworks.Add(a);
            }
        }
        
        await _context.SaveChangesAsync();
        
        return Ok("Seeded successfully");
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
