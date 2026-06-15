using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtworksController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public ArtworksController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetArtworks(
        [FromQuery] string? category,
        [FromQuery] string? tool,
        [FromQuery] string? year,
        [FromQuery] string? sort = "newest",
        [FromQuery] string? userId = null,
        [FromQuery] string? collaboratorId = null,
        [FromQuery] string? q = null,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 12)
    {
        var query = _context.Artworks.AsQueryable();

        if (!string.IsNullOrEmpty(collaboratorId))
        {
            query = query.Where(a => a.CollaboratorIds.Contains(collaboratorId));
        }
        else
        {
            query = query.Where(a => a.IsPublic);
        }

        if (!string.IsNullOrEmpty(q))
        {
            var searchLower = q.ToLower();
            query = query.Where(a => a.Title.ToLower().Contains(searchLower) || (a.Description != null && a.Description.ToLower().Contains(searchLower)));
        }

        if (!string.IsNullOrEmpty(category)) query = query.Where(a => a.Subject == category);
        if (!string.IsNullOrEmpty(tool)) query = query.Where(a => a.ToolsUsed.Contains(tool));
        if (!string.IsNullOrEmpty(year)) query = query.Where(a => a.AcademicYear == year);
        if (!string.IsNullOrEmpty(userId)) query = query.Where(a => a.UserId == userId);

        if (sort == "most_likes")
        {
            query = query.OrderByDescending(a => a.IsHighlighted).ThenByDescending(a => a.LikeCount);
        }
        else
        {
            query = query.OrderByDescending(a => a.IsHighlighted).ThenByDescending(a => a.CreatedAt);
        }

        var total = await query.CountAsync();
        var artworks = await query
            .Skip((page - 1) * limit)
            .Take(limit)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.Description,
                a.CoverImageUrl,
                a.Subject,
                a.AcademicYear,
                a.ToolsUsed,
                a.IsHighlighted,
                a.IsPublic,
                a.LikeCount,
                a.ViewCount,
                a.CreatedAt,
                a.Tags,
                a.FileUrls,
                User = new { a.User.Id, a.User.FullName, a.User.StudentId, a.User.AvatarUrl }
            })
            .ToListAsync();

        return Ok(new
        {
            artworks,
            total,
            page,
            limit,
            totalPages = (int)Math.Ceiling((double)total / limit)
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetArtwork(string id)
    {
        var artwork = await _context.Artworks
            .Include(a => a.User)
            .ThenInclude(u => u.PortfolioSettings)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (artwork == null) return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        bool isLiked = false;
        if (!string.IsNullOrEmpty(userId))
        {
            isLiked = await _context.Likes.AnyAsync(l => l.ArtworkId == id && l.UserId == userId);
        }

        var grade = await _context.Grades
            .Include(g => g.Lecturer)
            .Where(g => g.ArtworkId == id)
            .OrderByDescending(g => g.CreatedAt)
            .FirstOrDefaultAsync();

        object? gradeData = null;
        if (grade != null)
        {
            gradeData = new {
                grade.Id,
                grade.Score,
                grade.Comment,
                grade.CreatedAt,
                Lecturer = new { grade.Lecturer.Id, FullName = grade.Lecturer.FullName ?? "User", Email = grade.Lecturer.Email }
            };
        }

        var comments = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.ArtworkId == id)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new {
                c.Id,
                c.Content,
                c.CreatedAt,
                User = new { c.User.Id, FullName = c.User.FullName ?? "User", c.User.AvatarUrl }
            })
            .ToListAsync();

        var response = new
        {
            artwork.Id,
            artwork.Title,
            artwork.Description,
            artwork.CoverImageUrl,
            artwork.Subject,
            artwork.Semester,
            artwork.AcademicYear,
            artwork.ToolsUsed,
            artwork.IsHighlighted,
            artwork.IsPublic,
            artwork.LikeCount,
            artwork.ViewCount,
            artwork.CreatedAt,
            artwork.Tags,
            artwork.FileUrls,
            isLiked = isLiked,
            Grade = gradeData,
            Comments = comments,
            User = new { artwork.User.Id, artwork.User.FullName, artwork.User.StudentId, artwork.User.AvatarUrl, PortfolioSettings = artwork.User.PortfolioSettings }
        };

        return Ok(response);
    }

    [HttpPatch("{id}/view")]
    public async Task<IActionResult> IncrementView(string id)
    {
        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
        if (artwork == null) return NotFound();

        artwork.ViewCount += 1;
        await _context.SaveChangesAsync();
        return Ok(new { viewCount = artwork.ViewCount });
    }

    [HttpGet("{id}/related")]
    public async Task<IActionResult> GetRelated(string id, [FromQuery] int limit = 6)
    {
        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
        if (artwork == null) return NotFound();

        var related = await _context.Artworks
            .Include(a => a.User)
            .Include(a => a.User.PortfolioSettings)
            .Where(a => a.IsPublic && a.Id != id && a.UserId == artwork.UserId)
            .OrderByDescending(a => a.ViewCount)
            .Take(limit)
            .Select(a => new { a.Id, a.Title, a.CoverImageUrl, a.Subject, a.IsPublic, User = new { a.User.FullName, a.User.AvatarUrl } })
            .ToListAsync();

        return Ok(related);
    }

    [HttpPost("{id}/like")]
    [Authorize]
    public async Task<IActionResult> LikeArtwork(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
        if (artwork == null) return NotFound();

        var existingLike = await _context.Likes.FirstOrDefaultAsync(l => l.ArtworkId == id && l.UserId == userId);
        if (existingLike == null)
        {
            _context.Likes.Add(new Like
            {
                Id = Guid.NewGuid().ToString(),
                ArtworkId = id,
                UserId = userId,
                ReactionType = ReactionType.like,
                CreatedAt = DateTime.UtcNow
            });
            artwork.LikeCount++;
            await _context.SaveChangesAsync();
        }

        return Ok(new { success = true, likeCount = artwork.LikeCount });
    }

    [HttpDelete("{id}/like")]
    [Authorize]
    public async Task<IActionResult> UnlikeArtwork(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
        if (artwork == null) return NotFound();

        var existingLike = await _context.Likes.FirstOrDefaultAsync(l => l.ArtworkId == id && l.UserId == userId);
        if (existingLike != null)
        {
            _context.Likes.Remove(existingLike);
            if (artwork.LikeCount > 0) artwork.LikeCount--;
            await _context.SaveChangesAsync();
        }

        return Ok(new { success = true, likeCount = artwork.LikeCount });
    }

    [HttpGet("{id}/comments")]
    public async Task<IActionResult> GetComments(string id)
    {
        var comments = await _context.Comments
            .Where(c => c.ArtworkId == id)
            .OrderByDescending(c => c.CreatedAt)
            .Include(c => c.User)
            .Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                User = new { c.User.Id, FullName = c.User.FullName ?? "User", AvatarUrl = c.User.AvatarUrl }
            })
            .ToListAsync();
        return Ok(comments);
    }

    [HttpPost("{id}/comments")]
    [Authorize]
    public async Task<IActionResult> AddComment(string id, [FromBody] CreateCommentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        if (string.IsNullOrEmpty(dto.Content)) return BadRequest(new { error = "Content is required" });

        var comment = new Comment
        {
            Id = Guid.NewGuid().ToString(),
            ArtworkId = id,
            UserId = userId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
        };
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);
        return Ok(new
        {
            comment.Id,
            comment.Content,
            comment.CreatedAt,
            User = new { user.Id, FullName = user.FullName ?? "User", AvatarUrl = user.AvatarUrl }
        });
    }

    [HttpPut("{id}/grade")]
    [Authorize]
    public async Task<IActionResult> GradeArtwork(string id, [FromBody] GradeArtworkDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var grade = await _context.Grades.FirstOrDefaultAsync(g => g.ArtworkId == id && g.LecturerId == userId);

        if (grade != null)
        {
            grade.Score = (decimal)dto.Score;
            grade.Comment = dto.Comment ?? "";
            grade.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            grade = new Grade
            {
                Id = Guid.NewGuid().ToString(),
                ArtworkId = id,
                LecturerId = userId,
                Score = (decimal)dto.Score,
                Comment = dto.Comment ?? "",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Grades.Add(grade);
        }

        await _context.SaveChangesAsync();

        var lecturer = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        return Ok(new
        {
            score = grade.Score,
            comment = grade.Comment,
            lecturer = new
            {
                fullName = lecturer?.FullName,
                email = lecturer?.Email
            }
        });
    }

    [HttpGet("category-covers")]
    public async Task<IActionResult> GetCategoryCovers()
    {
        var categories = await _context.Artworks
            .Where(a => a.IsPublic && a.Subject != null)
            .GroupBy(a => a.Subject)
            .Select(g => new
            {
                subject = g.Key,
                coverImageUrl = g.OrderByDescending(a => a.ViewCount).Select(a => a.CoverImageUrl).FirstOrDefault()
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateArtwork([FromBody] CreateArtworkDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorName = User.FindFirstValue("FullName") ?? "Ai đó";

        if (string.IsNullOrEmpty(userId)) return Unauthorized();
        if (string.IsNullOrEmpty(dto.Title) || string.IsNullOrEmpty(dto.CoverImageUrl))
            return BadRequest(new { error = "Title and coverImageUrl are required" });

        var artwork = new Artwork
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            Title = dto.Title,
            Description = dto.Description,
            ToolsUsed = dto.ToolsUsed ?? new List<string>(),
            Subject = dto.Subject,
            Semester = dto.Semester,
            AcademicYear = dto.AcademicYear,
            Tags = dto.Tags ?? new List<string>(),
            Collaborators = dto.Collaborators ?? new List<string>(),
            CollaboratorIds = dto.CollaboratorIds ?? new List<string>(),
            CoverImageUrl = dto.CoverImageUrl,
            WatermarkImageUrl = dto.WatermarkImageUrl,
            FileUrls = dto.FileUrls ?? new List<string>(),
            WatermarkText = dto.WatermarkText,
            WatermarkPosition = dto.WatermarkPosition,
            IsPublic = false,
            IsPending = true,
            IsHighlighted = dto.IsHighlighted ?? false,
            IsAiConfirmed = dto.IsAiConfirmed ?? false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Artworks.Add(artwork);

        if (dto.CollaboratorIds != null && dto.CollaboratorIds.Any())
        {
            foreach (var collabId in dto.CollaboratorIds)
            {
                _context.Notifications.Add(new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = collabId,
                    Type = NotificationType.collaborator_tag,
                    ReferenceId = artwork.Id,
                    ReferenceType = "artwork",
                    Content = $"{actorName} đã thêm bạn làm đồng tác giả của ấn phẩm \"{artwork.Title}\"",
                    ActorId = userId,
                    ActorName = actorName,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();
        return StatusCode(201, artwork);
    }
}

public class CreateArtworkDto
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public List<string>? ToolsUsed { get; set; }
    public string? Subject { get; set; }
    public string? Semester { get; set; }
    public string? AcademicYear { get; set; }
    public List<string>? Tags { get; set; }
    public List<string>? Collaborators { get; set; }
    public List<string>? CollaboratorIds { get; set; }
    public required string CoverImageUrl { get; set; }
    public string? WatermarkImageUrl { get; set; }
    public List<string>? FileUrls { get; set; }
    public string? WatermarkText { get; set; }
    public string? WatermarkPosition { get; set; }
    public bool? IsHighlighted { get; set; }
    public bool? IsAiConfirmed { get; set; }
}

public class CreateCommentDto
{
    public required string Content { get; set; }
}

public class GradeArtworkDto
{
    public float Score { get; set; }
    public string? Comment { get; set; }
}
