using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PortfoliosController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public PortfoliosController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMyPortfolio()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _context.Users
            .Include(u => u.PortfolioSettings)
            .Include(u => u.Artworks)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound();

        if (user.PortfolioSettings == null)
        {
            user.PortfolioSettings = new PortfolioSetting
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                PortfolioSlug = "portfolio-" + userId.Substring(0, 4),
                ProfileHeadline = "Creative Designer & Developer",
                Major = "Thiết kế Đồ họa",
                YearLevel = "Tốt nghiệp",
                IsPortfolioPublic = true,
                SocialLinks = "{\"behance\":\"https://behance.net/uef_student\",\"linkedin\":\"https://linkedin.com/in/uef_student\"}",
                UpdatedAt = DateTime.UtcNow
            };
            _context.PortfolioSettings.Add(user.PortfolioSettings);

            var hasTimeline = await _context.TimelineEntrys.AnyAsync(t => t.UserId == userId);
            if (!hasTimeline)
            {
                _context.TimelineEntrys.AddRange(
                    new TimelineEntry { Id = Guid.NewGuid().ToString(), UserId = userId, Month = "Tháng 6", Year = "2023", Title = "First UI/UX Project", Description = "Designed a complete mobile app interface." },
                    new TimelineEntry { Id = Guid.NewGuid().ToString(), UserId = userId, Month = "Tháng 8", Year = "2024", Title = "Graduation Thesis", Description = "Completed my final project with a perfect score." }
                );
            }

            await _context.SaveChangesAsync();
        }

        var followersCount = await _context.Follows.CountAsync(f => f.FollowedId == userId);
        var followingCount = await _context.Follows.CountAsync(f => f.FollowerId == userId);

        var stats = new
        {
            totalArtworks = user.Artworks.Count,
            totalViews = user.Artworks.Sum(a => a.ViewCount),
            totalLikes = user.Artworks.Sum(a => a.LikeCount),
            publicArtworks = user.Artworks.Count(a => a.IsPublic),
            followers = followersCount,
            following = followingCount,
            isFollowing = false
        };

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.AvatarUrl,
            user.Bio,
            user.Major,
            Settings = user.PortfolioSettings,
            Artworks = user.Artworks,
            stats = stats
        });
    }

    [HttpGet("mine")]
    [Authorize]
    public async Task<IActionResult> GetMyPortfolioDetailed()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var settings = await _context.PortfolioSettings.FirstOrDefaultAsync(s => s.UserId == userId);
        
        if (settings == null)
        {
            // Tự động tạo dữ liệu mẫu cho user nếu chưa có (để phục vụ test)
            settings = new PortfolioSetting
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                PortfolioSlug = "portfolio-" + userId.Substring(0, 4),
                ProfileHeadline = "Creative Designer & Developer",
                Major = "Thiết kế Đồ họa",
                YearLevel = "Tốt nghiệp",
                IsPortfolioPublic = true,
                SocialLinks = "{\"behance\":\"https://behance.net/uef_student\",\"linkedin\":\"https://linkedin.com/in/uef_student\"}",
                UpdatedAt = DateTime.UtcNow
            };
            _context.PortfolioSettings.Add(settings);
            
            // Seed 2 timeline entries
            _context.TimelineEntrys.AddRange(
                new TimelineEntry { Id = Guid.NewGuid().ToString(), UserId = userId, Month = "Tháng 6", Year = "2023", Title = "First UI/UX Project", Description = "Designed a complete mobile app interface." },
                new TimelineEntry { Id = Guid.NewGuid().ToString(), UserId = userId, Month = "Tháng 8", Year = "2024", Title = "Graduation Thesis", Description = "Completed my final project with a perfect score." }
            );

            await _context.SaveChangesAsync();
        }

        return Ok(settings);
    }

    [HttpPut("mine")]
    [Authorize]
    public async Task<IActionResult> UpdateMyPortfolio([FromBody] PortfolioSettingDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var settings = await _context.PortfolioSettings.FirstOrDefaultAsync(s => s.UserId == userId);

        if (settings == null)
        {
            settings = new PortfolioSetting
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                ProfileHeadline = dto.ProfileHeadline,
                SocialLinks = dto.SocialLinks,
                PortfolioSlug = dto.PortfolioSlug,
                Major = dto.Major,
                YearLevel = dto.YearLevel,
                IsPortfolioPublic = dto.IsPortfolioPublic ?? true,
                FeaturedArtworkIds = dto.FeaturedArtworkIds,
                BannerUrl = dto.BannerUrl,
                UpdatedAt = DateTime.UtcNow
            };
            _context.PortfolioSettings.Add(settings);
        }
        else
        {
            settings.ProfileHeadline = dto.ProfileHeadline ?? settings.ProfileHeadline;
            settings.SocialLinks = dto.SocialLinks ?? settings.SocialLinks;
            settings.PortfolioSlug = dto.PortfolioSlug ?? settings.PortfolioSlug;
            settings.Major = dto.Major ?? settings.Major;
            settings.YearLevel = dto.YearLevel ?? settings.YearLevel;
            if (dto.IsPortfolioPublic.HasValue) settings.IsPortfolioPublic = dto.IsPortfolioPublic.Value;
            if (dto.FeaturedArtworkIds != null) settings.FeaturedArtworkIds = dto.FeaturedArtworkIds;
            if (dto.BannerUrl != null) settings.BannerUrl = dto.BannerUrl;
            settings.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Ok(settings);
    }

    [HttpPut("mine/visibility")]
    [Authorize]
    public async Task<IActionResult> ToggleVisibility([FromBody] VisibilityDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var settings = await _context.PortfolioSettings.FirstOrDefaultAsync(s => s.UserId == userId);

        if (settings == null) return NotFound(new { error = "Chưa thiết lập portfolio." });

        settings.IsPortfolioPublic = dto.IsPortfolioPublic;
        await _context.SaveChangesAsync();

        return Ok(new { success = true, isPublic = settings.IsPortfolioPublic });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetPortfolioBySlug(string slug)
    {
        var user = await _context.Users
            .Include(u => u.PortfolioSettings)
            .Include(u => u.Artworks.Where(a => a.IsPublic))
            .FirstOrDefaultAsync(u => 
                (u.PortfolioSettings != null && u.PortfolioSettings.PortfolioSlug == slug) || 
                u.Id == slug || 
                u.StudentId == slug);

        if (user == null)
            return NotFound(new { error = "Portfolio không tồn tại." });
            
        if (user.PortfolioSettings != null && !user.PortfolioSettings.IsPortfolioPublic)
            return NotFound(new { error = "Portfolio đang riêng tư." });

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.AvatarUrl,
            user.Bio,
            user.Major,
            Settings = user.PortfolioSettings,
            Artworks = user.Artworks
        });
    }

    [HttpGet("{slug}/stats")]
    public async Task<IActionResult> GetPortfolioStats(string slug)
    {
        var user = await _context.Users
            .Include(u => u.PortfolioSettings)
            .FirstOrDefaultAsync(u => 
                (u.PortfolioSettings != null && u.PortfolioSettings.PortfolioSlug == slug) || 
                u.Id == slug || 
                u.StudentId == slug);

        if (user == null) return NotFound();

        var myArtworks = await _context.Artworks
            .Where(a => a.UserId == user.Id)
            .ToListAsync();

        var followersCount = await _context.Follows.CountAsync(f => f.FollowedId == user.Id);
        var followingCount = await _context.Follows.CountAsync(f => f.FollowerId == user.Id);

        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        bool isFollowing = false;
        if (!string.IsNullOrEmpty(currentUserId))
        {
            isFollowing = await _context.Follows.AnyAsync(f => f.FollowerId == currentUserId && f.FollowedId == user.Id);
        }

        return Ok(new
        {
            totalArtworks = myArtworks.Count,
            totalViews = myArtworks.Sum(a => a.ViewCount),
            totalLikes = myArtworks.Sum(a => a.LikeCount),
            publicArtworks = myArtworks.Count(a => a.IsPublic),
            followers = followersCount,
            following = followingCount,
            isFollowing = isFollowing
        });
    }

    [HttpPost("{slug}/contact")]
    public async Task<IActionResult> Contact(string slug, [FromBody] ContactDto dto)
    {
        var user = await _context.Users
            .Include(u => u.PortfolioSettings)
            .FirstOrDefaultAsync(u => 
                (u.PortfolioSettings != null && u.PortfolioSettings.PortfolioSlug == slug) || 
                u.Id == slug || 
                u.StudentId == slug);

        if (user == null) return NotFound();

        var message = new Message
        {
            Id = Guid.NewGuid().ToString(),
            RecipientId = user.Id,
            SenderName = dto.SenderName,
            SenderEmail = dto.SenderEmail,
            Purpose = dto.Purpose ?? "contact",
            Content = dto.Content,
            IsRead = false,
            IsArchived = false,
            CreatedAt = DateTime.UtcNow
        };
        _context.Messages.Add(message);

        var notification = new Notification
        {
            Id = Guid.NewGuid().ToString(),
            UserId = user.Id,
            Type = NotificationType.new_message,
            Content = $"Bạn có liên hệ mới từ {dto.SenderName} qua Portfolio",
            CreatedAt = DateTime.UtcNow
        };
        _context.Notifications.Add(notification);

        await _context.SaveChangesAsync();
        return Ok(new { success = true, message = "Đã gửi liên hệ." });
    }
}

public class PortfolioSettingDto
{
    public string? ProfileHeadline { get; set; }
    public string? SocialLinks { get; set; }
    public string? PortfolioSlug { get; set; }
    public string? Major { get; set; }
    public string? YearLevel { get; set; }
    public bool? IsPortfolioPublic { get; set; }
    public List<string>? FeaturedArtworkIds { get; set; }
    public string? BannerUrl { get; set; }
}

public class VisibilityDto
{
    public bool IsPortfolioPublic { get; set; }
}

public class ContactDto
{
    public required string SenderName { get; set; }
    public required string SenderEmail { get; set; }
    public string? Purpose { get; set; }
    public required string Content { get; set; }
}
