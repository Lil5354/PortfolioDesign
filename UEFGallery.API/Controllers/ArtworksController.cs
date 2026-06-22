using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UEFGallery.API.Data;
using UEFGallery.API.Models;
using UEFGallery.API.Services.Background;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtworksController : ControllerBase
{
    private readonly GalleryDbContext _context;
    private readonly FanoutEventChannel _fanoutChannel;

    public ArtworksController(GalleryDbContext context, FanoutEventChannel fanoutChannel)
    {
        _context = context;
        _fanoutChannel = fanoutChannel;
    }

    [HttpGet("feed")]
    [Authorize]
    public async Task<IActionResult> GetFeed([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(currentUserId)) return Unauthorized();

        var skip = (page - 1) * limit;

        var followingIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FollowedId)
            .ToListAsync();

        if (!followingIds.Any())
        {
            return Ok(new { artworks = new List<object>(), total = 0, page, limit, totalPages = 0 });
        }

        var query = _context.Artworks
            .Include(a => a.User)
            .Where(a => followingIds.Contains(a.UserId) && a.IsPublic && !a.IsPending);

        var total = await query.CountAsync();
        var artworks = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip(skip)
            .Take(limit)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.Subject,
                a.CoverImageUrl,
                a.ToolsUsed,
                a.Tags,
                a.LikeCount,
                a.ViewCount,
                a.IsPublic,
                a.CreatedAt,
                a.BlocksJson,
                User = new { a.User.Id, a.User.FullName, a.User.StudentId, a.User.AvatarUrl, PortfolioSettings = a.User.PortfolioSettings }
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

    [HttpGet]
    public async Task<IActionResult> GetArtworks(
        [FromQuery] string? category,
        [FromQuery] string? tool,
        [FromQuery] string? year,
        [FromQuery] string? sort = "newest",
        [FromQuery] string? userId = null,
        [FromQuery] string? collaboratorId = null,
        [FromQuery] string? q = null,
        [FromQuery] bool? hasBadge = null,
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
        if (hasBadge == true)
        {
            var badgeQuery = _context.ArtworkBadges.Select(ab => ab.ArtworkId).Distinct();
            query = query.Where(a => badgeQuery.Contains(a.Id));
        }
        
        if (Request.Query.ContainsKey("isPending"))
        {
            if (bool.TryParse(Request.Query["isPending"], out bool isPendingVal))
            {
                query = query.Where(a => a.IsPending == isPendingVal);
            }
        }

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
                a.CoverImageUrl,
                a.OriginalCoverUrl,
                a.Subject,
                a.AcademicYear,
                a.ToolsUsed,
                a.IsHighlighted,
                a.IsPublic,
                a.IsPending,
                a.LikeCount,
                a.ViewCount,
                a.CreatedAt,
                a.Tags,
                a.FileUrls,
                a.BlocksJson,
                Badges = _context.ArtworkBadges.Where(ab => ab.ArtworkId == a.Id).Select(ab => new { ab.Badge.Id, ab.Badge.Name, ab.Badge.ColorCode }).ToList(),
                User = new { a.User.Id, a.User.FullName, a.User.StudentId, a.User.AvatarUrl, PortfolioSettings = a.User.PortfolioSettings }
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
            .Include(a => a.ArtworkBadges)
            .ThenInclude(ab => ab.Badge)
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
            var role = User.FindFirstValue(ClaimTypes.Role);
            bool canSeePrivate = role == "admin" || grade.LecturerId == userId;
            
            gradeData = new {
                grade.Id,
                grade.Score,
                Comment = (!grade.IsVisibleToStudent && !canSeePrivate) ? null : grade.Comment,
                grade.IsVisibleToStudent,
                grade.CreatedAt,
                Lecturer = new { grade.Lecturer.Id, FullName = grade.Lecturer.FullName ?? "User", Email = grade.Lecturer.Email }
            };
        }

        var currentUserId = User?.FindFirstValue(ClaimTypes.NameIdentifier);
        var currentUserRole = User?.FindFirstValue(ClaimTypes.Role);

        var comments = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.ArtworkId == id)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var filteredComments = comments.Where(c => 
            c.PositionX == null || // Public comment
            c.UserId == currentUserId || // My comment
            artwork.UserId == currentUserId || // I am the author
            currentUserRole == "admin" // I am admin
        ).Select(c => new {
            c.Id,
            c.Content,
            c.PositionX,
            c.PositionY,
            c.TargetImageIndex,
            c.CreatedAt,
            User = new { c.User.Id, FullName = c.User.FullName ?? "User", c.User.AvatarUrl, PortfolioSettings = c.User.PortfolioSettings }
        }).ToList();

        var response = new
        {
            artwork.Id,
            artwork.Title,
            artwork.Description,
            artwork.CoverImageUrl,
            artwork.OriginalCoverUrl,
            artwork.Subject,
            artwork.Semester,
            artwork.AcademicYear,
            artwork.ToolsUsed,
            artwork.IsHighlighted,
            artwork.IsPublic,
            artwork.IsPending,
            artwork.LikeCount,
            artwork.ViewCount,
            artwork.CreatedAt,
            artwork.Tags,
            artwork.FileUrls,
            artwork.BlocksJson,
            artwork.IsAiVerified,
            artwork.AiScore,
            artwork.AiGeneratedPct,
            isLiked = isLiked,
            Grade = gradeData,
            Badges = artwork.ArtworkBadges.Select(ab => new { ab.Badge.Id, ab.Badge.Name, ab.Badge.ColorCode, ab.Badge.LecturerId }).ToList(),
            Comments = filteredComments,
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
            .Select(a => new { a.Id, a.Title, a.CoverImageUrl, a.Subject, a.IsPublic, User = new { a.User.Id, a.User.FullName, a.User.AvatarUrl, PortfolioSettings = a.User.PortfolioSettings } })
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
        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
        if (artwork == null) return NotFound();

        var currentUserId = User?.FindFirstValue(ClaimTypes.NameIdentifier);
        var currentUserRole = User?.FindFirstValue(ClaimTypes.Role);

        var comments = await _context.Comments
            .Where(c => c.ArtworkId == id)
            .OrderByDescending(c => c.CreatedAt)
            .Include(c => c.User)
            .ToListAsync();

        var filteredComments = comments.Where(c => 
            c.PositionX == null || // Public comment
            c.UserId == currentUserId || // My comment
            artwork.UserId == currentUserId || // I am the author
            currentUserRole == "admin" // I am admin
        ).Select(c => new
        {
            c.Id,
            c.Content,
            c.PositionX,
            c.PositionY,
            c.TargetImageIndex,
            c.CreatedAt,
            User = new { c.User.Id, FullName = c.User.FullName ?? "User", AvatarUrl = c.User.AvatarUrl, PortfolioSettings = c.User.PortfolioSettings }
        }).ToList();

        return Ok(filteredComments);
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
            PositionX = dto.PositionX,
            PositionY = dto.PositionY,
            TargetImageIndex = dto.TargetImageIndex,
            CreatedAt = DateTime.UtcNow,
        };
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);
        return Ok(new
        {
            Comment = new { 
                comment.Id, 
                comment.Content, 
                comment.PositionX, 
                comment.PositionY, 
                comment.TargetImageIndex, 
                comment.CreatedAt, 
                User = new { user.Id, FullName = user.FullName ?? "User", user.AvatarUrl, PortfolioSettings = user.PortfolioSettings }
            }
        });
    }

    [HttpPut("{id}/comments/{commentId}")]
    [Authorize]
    public async Task<IActionResult> UpdateComment(string id, string commentId, [FromBody] UpdateCommentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.ArtworkId == id);
        if (comment == null) return NotFound();
        if (comment.UserId != userId) return Forbid();

        if (dto.PositionX.HasValue) comment.PositionX = dto.PositionX.Value;
        if (dto.PositionY.HasValue) comment.PositionY = dto.PositionY.Value;

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpDelete("{id}/comments/{commentId}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(string id, string commentId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);
        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.ArtworkId == id);
        if (comment == null) return NotFound();

        if (comment.UserId != userId && role != "admin") return Forbid();

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPost("{id}/grade")]
    [Authorize]
    public async Task<IActionResult> GradeArtwork(string id, [FromBody] GradeArtworkDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var grade = await _context.Grades.FirstOrDefaultAsync(g => g.ArtworkId == id && g.LecturerId == userId);
        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
        if (artwork == null) return NotFound();

        if (grade != null)
        {
            grade.Score = (decimal)dto.Score;
            grade.Comment = dto.Comment ?? "";
            grade.IsVisibleToStudent = dto.IsVisibleToStudent;
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
                IsVisibleToStudent = dto.IsVisibleToStudent,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Grades.Add(grade);
        }

        // Grading approves the artwork
        artwork.IsPending = false;
        
        // If Lecturer forces public, or if we want to let student do it later, we don't change IsPublic here.
        // We will just leave IsPublic as is, giving student the ability to publicize it.
        artwork.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var lecturer = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        return Ok(new
        {
            score = grade.Score,
            comment = grade.Comment,
            isVisibleToStudent = grade.IsVisibleToStudent,
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

    [HttpGet("tool-covers")]
    public async Task<IActionResult> GetToolCovers()
    {
        var artworks = await _context.Artworks
            .Where(a => a.IsPublic && a.ToolsUsed != null && a.ToolsUsed.Any())
            .Select(a => new { a.ToolsUsed, a.CoverImageUrl, a.ViewCount })
            .ToListAsync();

        var toolCovers = artworks
            .SelectMany(a => a.ToolsUsed.Select(t => new { Tool = t, a.CoverImageUrl, a.ViewCount }))
            .GroupBy(x => x.Tool)
            .Select(g => new
            {
                tool = g.Key,
                coverImageUrl = g.OrderByDescending(x => x.ViewCount).Select(x => x.CoverImageUrl).FirstOrDefault()
            })
            .ToList();

        return Ok(toolCovers);
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
            CollaboratorIds = dto.CollaboratorIds ?? new List<string>(),
            CoverImageUrl = dto.CoverImageUrl,
            OriginalCoverUrl = dto.OriginalCoverUrl,
            WatermarkImageUrl = dto.WatermarkImageUrl,
            FileUrls = dto.FileUrls,
            BlocksJson = dto.BlocksJson,
            WatermarkText = dto.WatermarkText,
            WatermarkPosition = dto.WatermarkPosition,
            IsPublic = false,
            IsPending = true,
            IsHighlighted = dto.IsHighlighted ?? false,
            IsAiConfirmed = dto.IsAiConfirmed ?? false,
            AiScore = dto.AiScore,
            AiGeneratedPct = dto.AiGeneratedPct,
            IsAiVerified = dto.IsAiVerified ?? false,
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

    [HttpGet("seed-test")]
    public async Task<IActionResult> SeedTestArtwork()
    {
        var user = await _context.Users.FirstOrDefaultAsync();
        if (user == null) return BadRequest("No users found");

        var blocks = new List<object>
        {
            new { id = "b1", type = "text", content = "Đây là khối văn bản (Text Block).\nNó có thể dùng để giới thiệu về Case Study, mục tiêu của dự án, hoặc giải thích về quá trình thiết kế." },
            new { id = "b2", type = "image", data = new { url = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" } },
            new { id = "b3", type = "color", data = new { colors = new[] { "#1a4ba8", "#0ea5e9", "#facc15", "#dc2626" } } },
            new { id = "b4", type = "typography", data = new { fontName = "Montserrat" } },
            new { id = "b5", type = "text", content = "Kết luận: Bằng cách sử dụng Typography Montserrat và bảng màu hiện đại, dự án mang lại cảm giác năng động và chuyên nghiệp." }
        };

        var artwork = new Artwork
        {
            Id = Guid.NewGuid().ToString(),
            UserId = user.Id,
            Title = "Full Case Study Builder Demo",
            Description = "A test artwork containing all blocks for UI testing.",
            ToolsUsed = new List<string> { "Figma", "Photoshop", "Illustrator" },
            Subject = "Thiết kế Đồ họa",
            Semester = "HK1",
            AcademicYear = "2024-2025",
            Tags = new List<string> { "UI/UX", "Branding", "Case Study" },
            CollaboratorIds = new List<string>(),
            CoverImageUrl = "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop",
            OriginalCoverUrl = "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop",
            WatermarkImageUrl = "",
            FileUrls = new List<string> { "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2074&auto=format&fit=crop" },
            BlocksJson = System.Text.Json.JsonSerializer.Serialize(blocks),
            WatermarkText = "TEST",
            WatermarkPosition = "bottom-right",
            IsPublic = true,
            IsPending = false,
            IsHighlighted = false,
            IsAiConfirmed = true,
            AiScore = 95,
            AiGeneratedPct = 5,
            IsAiVerified = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Artworks.Add(artwork);
        await _context.SaveChangesAsync();
        
        return Ok(artwork);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateArtwork(string id, [FromBody] UpdateArtworkDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
        if (artwork == null) return NotFound();

        // Check ownership or admin
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (artwork.UserId != userId && role != "admin") return Forbid();

        bool becamePublic = false;
        if (dto.IsPublic.HasValue)
        {
            if (dto.IsPublic.Value == true && !artwork.IsPublic && role != "admin")
            {
                return BadRequest(new { error = "Sinh viên không được tự động công khai ấn phẩm." });
            }
            if (dto.IsPublic.Value && !artwork.IsPublic)
            {
                becamePublic = true;
            }
            artwork.IsPublic = dto.IsPublic.Value;
        }

        if (dto.Title != null) artwork.Title = dto.Title;
        if (dto.Description != null) artwork.Description = dto.Description;
        if (dto.ToolsUsed != null) artwork.ToolsUsed = dto.ToolsUsed;
        if (dto.Subject != null) artwork.Subject = dto.Subject;
        if (dto.Semester != null) artwork.Semester = dto.Semester;
        if (dto.AcademicYear != null) artwork.AcademicYear = dto.AcademicYear;
        if (!string.IsNullOrEmpty(dto.CoverImageUrl)) artwork.CoverImageUrl = dto.CoverImageUrl;
        if (!string.IsNullOrEmpty(dto.OriginalCoverUrl)) artwork.OriginalCoverUrl = dto.OriginalCoverUrl;
        if (dto.WatermarkImageUrl != null) artwork.WatermarkImageUrl = dto.WatermarkImageUrl;
        if (dto.FileUrls != null) artwork.FileUrls = dto.FileUrls;
        if (dto.BlocksJson != null) artwork.BlocksJson = dto.BlocksJson;
        if (dto.WatermarkText != null) artwork.WatermarkText = dto.WatermarkText;
        if (dto.WatermarkPosition != null) artwork.WatermarkPosition = dto.WatermarkPosition;

        artwork.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        if (becamePublic)
        {
            var actorName = User.FindFirstValue("FullName") ?? "Ai đó";
            await _fanoutChannel.AddEventAsync(new FanoutEvent { ArtworkId = artwork.Id, ActorId = artwork.UserId, ActorName = actorName, ArtworkTitle = artwork.Title ?? "Tác phẩm mới" });
        }

        return Ok(artwork);
    }

    [HttpPost("{id}/report")]
    [AllowAnonymous]
    public async Task<IActionResult> ReportArtwork(string id, [FromBody] ReportArtworkDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var artwork = await _context.Artworks.FindAsync(id);
        if (artwork == null) return NotFound(new { message = "Artwork not found" });

        var report = new Report
        {
            Id = Guid.NewGuid().ToString(),
            ArtworkId = id,
            UserId = userId,
            ViolationType = dto.ViolationType ?? "Other",
            Detail = dto.Detail,
            Status = ReportStatus.pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Report submitted successfully", report });
    }

    [HttpGet("{id}/reports")]
    [Authorize(Roles = "admin,lecturer")]
    public async Task<IActionResult> GetReports(string id)
    {
        var reports = await _context.Reports
            .Include(r => r.User)
            .Where(r => r.ArtworkId == id)
            .Select(r => new {
                r.Id,
                r.ViolationType,
                r.Detail,
                r.Status,
                r.CreatedAt,
                User = r.User != null ? new { r.User.Id, r.User.FullName, r.User.Email, r.User.AvatarUrl } : null
            })
            .ToListAsync();
        return Ok(reports);
    }

    [HttpPatch("{id}/reports/{reportId}/status")]
    [Authorize(Roles = "admin,lecturer")]
    public async Task<IActionResult> UpdateReportStatus(string id, string reportId, [FromBody] UpdateReportStatusDto dto)
    {
        var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == reportId && r.ArtworkId == id);
        if (report == null) return NotFound(new { message = "Report not found" });

        if (Enum.TryParse<ReportStatus>(dto.Status, true, out var parsedStatus))
        {
            report.Status = parsedStatus;
            report.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Report status updated", report });
        }
        return BadRequest(new { message = "Invalid status" });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteArtwork(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
        if (artwork == null) return NotFound();

        var role = User.FindFirstValue(ClaimTypes.Role);
        if (artwork.UserId != userId && role != "admin") return Forbid();

        var relatedCollectionItems = _context.CollectionItems.Where(c => c.ArtworkId == id);
        _context.CollectionItems.RemoveRange(relatedCollectionItems);
        var relatedBadges = _context.ArtworkBadges.Where(b => b.ArtworkId == id);
        _context.ArtworkBadges.RemoveRange(relatedBadges);
        var relatedLikes = _context.Likes.Where(l => l.ArtworkId == id);
        _context.Likes.RemoveRange(relatedLikes);
        var relatedComments = _context.Comments.Where(c => c.ArtworkId == id);
        _context.Comments.RemoveRange(relatedComments);
        var relatedNotifications = _context.Notifications.Where(n => n.ReferenceId == id && n.ReferenceType == "artwork");
        _context.Notifications.RemoveRange(relatedNotifications);
        var relatedGrades = _context.Grades.Where(g => g.ArtworkId == id);
        _context.Grades.RemoveRange(relatedGrades);
        var relatedReports = _context.Reports.Where(r => r.ArtworkId == id);
        _context.Reports.RemoveRange(relatedReports);

        _context.Artworks.Remove(artwork);
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPatch("{id}/visibility")]
    [Authorize]
    public async Task<IActionResult> ToggleVisibility(string id, [FromBody] UpdateVisibilityDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
        if (artwork == null) return NotFound();

        var role = User.FindFirstValue(ClaimTypes.Role);
        if (artwork.UserId != userId && role != "admin") return Forbid();

        if (dto.IsPublic && !artwork.IsPublic && role != "admin")
        {
            return BadRequest(new { error = "Sinh viên không được tự động công khai ấn phẩm." });
        }
        bool becamePublic = dto.IsPublic && !artwork.IsPublic;
        artwork.IsPublic = dto.IsPublic;
        artwork.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        if (becamePublic)
        {
            var actorName = User.FindFirstValue("FullName") ?? "Ai đó";
            await _fanoutChannel.AddEventAsync(new FanoutEvent { ArtworkId = artwork.Id, ActorId = artwork.UserId, ActorName = actorName, ArtworkTitle = artwork.Title ?? "Tác phẩm mới" });
        }

        return Ok(new { success = true, isPublic = artwork.IsPublic });
    }
}

public class ReportArtworkDto
{
    public string ViolationType { get; set; } = string.Empty;
    public string? Detail { get; set; }
}

public class UpdateReportStatusDto
{
    public required string Status { get; set; }
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
    public List<string>? CollaboratorIds { get; set; }
    public required string CoverImageUrl { get; set; }
    public string? OriginalCoverUrl { get; set; }
    public string? WatermarkImageUrl { get; set; }
    public List<string>? FileUrls { get; set; }
    public string? BlocksJson { get; set; }
    public string? WatermarkText { get; set; }
    public string? WatermarkPosition { get; set; }
    public bool? IsHighlighted { get; set; }
    public bool? IsAiConfirmed { get; set; }
    public int? AiScore { get; set; }
    public int? AiGeneratedPct { get; set; }
    public bool? IsAiVerified { get; set; }
}

public class UpdateArtworkDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public List<string>? ToolsUsed { get; set; }
    public string? Subject { get; set; }
    public string? Semester { get; set; }
    public string? AcademicYear { get; set; }
    public List<string>? Tags { get; set; }
    public List<string>? CollaboratorIds { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? OriginalCoverUrl { get; set; }
    public string? WatermarkImageUrl { get; set; }
    public List<string>? FileUrls { get; set; }
    public string? BlocksJson { get; set; }
    public string? WatermarkText { get; set; }
    public string? WatermarkPosition { get; set; }
    public bool? IsPublic { get; set; }
}

public class CreateCommentDto
{
    public required string Content { get; set; }
    public double? PositionX { get; set; }
    public double? PositionY { get; set; }
    public int? TargetImageIndex { get; set; }
}

public class UpdateCommentDto
{
    public double? PositionX { get; set; }
    public double? PositionY { get; set; }
}

public class UpdateVisibilityDto
{
    public bool IsPublic { get; set; }
}

public class GradeArtworkDto
{
    public float Score { get; set; }
    public string? Comment { get; set; }
    public bool IsVisibleToStudent { get; set; } = false;
}
