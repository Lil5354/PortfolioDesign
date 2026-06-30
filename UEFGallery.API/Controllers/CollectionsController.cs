using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CollectionsController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public CollectionsController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCollections()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var items = await _context.CollectionItems
            .Include(c => c.Artwork)
            .ThenInclude(a => a.User)
            .Where(c => c.LecturerId == userId)
            .OrderByDescending(c => c.AddedAt)
            .ToListAsync();

        var grouped = items.GroupBy(x => x.CollectionName ?? "Untitled")
            .Select(g => new
            {
                id = g.Key,
                name = g.Key,
                theme = g.FirstOrDefault()?.Theme ?? "Classic",
                curatorEssay = g.FirstOrDefault()?.CuratorEssay ?? "",
                items = g.Select(x => new
                {
                    id = x.Id,
                    artworkId = x.ArtworkId,
                    note = x.Note,
                    isHidden = false,
                    category = x.Artwork.Subject,
                    award = "Không có",
                    artwork = new
                    {
                        id = x.ArtworkId,
                        title = x.Artwork.Title,
                        coverImageUrl = x.Artwork.CoverImageUrl,
                        subject = x.Artwork.Subject,
                        user = new
                        {
                            fullName = x.Artwork.User?.FullName,
                            email = x.Artwork.User?.Email
                        }
                    }
                }).ToList()
            });

        return Ok(grouped);
    }

    [HttpGet("user/{userId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCollectionsByUser(string userId)
    {
        var items = await _context.CollectionItems
            .Include(c => c.Artwork)
            .ThenInclude(a => a.User)
            .Where(c => c.LecturerId == userId)
            .OrderByDescending(c => c.AddedAt)
            .ToListAsync();

        var grouped = items.GroupBy(x => x.CollectionName ?? "Untitled")
            .Select(g => new
            {
                id = g.Key,
                name = g.Key,
                theme = g.FirstOrDefault()?.Theme ?? "Classic",
                curatorEssay = g.FirstOrDefault()?.CuratorEssay ?? "",
                items = g.Where(x => x.ArtworkId != "METADATA_DUMMY_ARTWORK").Select(x => new
                {
                    id = x.Id,
                    artworkId = x.ArtworkId,
                    note = x.Note,
                    isHidden = false,
                    category = x.Artwork?.Subject,
                    award = "Không có",
                    artwork = x.Artwork == null ? null : new
                    {
                        id = x.ArtworkId,
                        title = x.Artwork.Title,
                        coverImageUrl = x.Artwork.CoverImageUrl,
                        subject = x.Artwork.Subject,
                        user = new
                        {
                            fullName = x.Artwork.User?.FullName,
                            email = x.Artwork.User?.Email
                        }
                    }
                }).Where(x => x.artwork != null).ToList()
            });

        return Ok(grouped);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateCollection([FromBody] CreateCollectionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        var dummyId = "METADATA_DUMMY_ARTWORK";
        var dummy = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == dummyId);
        if (dummy == null) {
            dummy = new Artwork {
                Id = dummyId,
                UserId = userId ?? "admin",
                Title = "System Metadata",
                Subject = "System",
                CoverImageUrl = "",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Artworks.Add(dummy);
            await _context.SaveChangesAsync();
        }

        var existingItem = await _context.CollectionItems
            .FirstOrDefaultAsync(c => c.LecturerId == userId && c.CollectionName == dto.CollectionName && c.ArtworkId == dummyId);
            
        if (existingItem == null) {
            var item = new CollectionItem {
                Id = Guid.NewGuid().ToString(),
                LecturerId = userId ?? "",
                ArtworkId = dummyId,
                CollectionName = dto.CollectionName,
                Theme = "Classic",
                CuratorEssay = "",
                AddedAt = DateTime.UtcNow
            };
            _context.CollectionItems.Add(item);
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            id = dto.CollectionName,
            name = dto.CollectionName,
            theme = "Classic",
            curatorEssay = "",
            items = new object[] { }
        });
    }

    [HttpPut("{collectionId}")]
    [Authorize]
    public async Task<IActionResult> UpdateCollection(string collectionId, [FromBody] UpdateCollectionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var items = await _context.CollectionItems
            .Where(c => c.LecturerId == userId && c.CollectionName == collectionId)
            .ToListAsync();

        if (!items.Any()) return NotFound();

        foreach (var item in items)
        {
            if (dto.Name != null) item.CollectionName = dto.Name;
            if (dto.CuratorEssay != null) item.CuratorEssay = dto.CuratorEssay;
            if (dto.Theme != null) item.Theme = dto.Theme;
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpDelete("{collectionId}")]
    [Authorize]
    public async Task<IActionResult> DeleteCollection(string collectionId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var items = await _context.CollectionItems
            .Where(c => c.LecturerId == userId && c.CollectionName == collectionId)
            .ToListAsync();

        if (!items.Any()) return NotFound();

        _context.CollectionItems.RemoveRange(items);
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPost("{collectionId}/items")]
    [Authorize]
    public async Task<IActionResult> AddItem(string collectionId, [FromBody] AddCollectionItemDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (string.IsNullOrEmpty(dto.ArtworkId)) return BadRequest(new { error = "ArtworkId is required." });

        var existing = await _context.CollectionItems
            .FirstOrDefaultAsync(c => c.LecturerId == userId && c.CollectionName == collectionId && c.ArtworkId == dto.ArtworkId);

        if (existing != null) return BadRequest(new { error = "Tác phẩm này đã có trong bộ sưu tập." });

        var item = new CollectionItem
        {
            Id = Guid.NewGuid().ToString(),
            LecturerId = userId,
            ArtworkId = dto.ArtworkId,
            CollectionName = collectionId,
            Note = dto.Note,
            AddedAt = DateTime.UtcNow
        };

        var otherItem = await _context.CollectionItems.FirstOrDefaultAsync(c => c.LecturerId == userId && c.CollectionName == collectionId);
        if (otherItem != null)
        {
            item.Theme = otherItem.Theme;
            item.CuratorEssay = otherItem.CuratorEssay;
        }

        _context.CollectionItems.Add(item);

        var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == dto.ArtworkId);
        if (artwork != null && artwork.UserId != userId)
        {
            var noti = new Notification
            {
                Id = Guid.NewGuid().ToString(),
                UserId = artwork.UserId,
                ActorId = userId,
                Type = NotificationType.artwork_saved,
                ReferenceId = artwork.Id,
                ReferenceType = "artwork",
                Content = "đã lưu ấn phẩm của bạn vào Moodboard.",
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };
            _context.Notifications.Add(noti);
        }

        await _context.SaveChangesAsync();

        return Ok(item);
    }

    [HttpDelete("{collectionId}/items/{artworkId}")]
    [Authorize]
    public async Task<IActionResult> RemoveItem(string collectionId, string artworkId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var item = await _context.CollectionItems
            .FirstOrDefaultAsync(c => c.LecturerId == userId && c.CollectionName == collectionId && c.ArtworkId == artworkId);

        if (item == null) return NotFound();

        _context.CollectionItems.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPatch("{collectionId}/items/{artworkId}")]
    [Authorize]
    public async Task<IActionResult> UpdateItemNote(string collectionId, string artworkId, [FromBody] UpdateItemNoteDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var item = await _context.CollectionItems
            .FirstOrDefaultAsync(c => c.LecturerId == userId && c.CollectionName == collectionId && c.ArtworkId == artworkId);

        if (item == null) return NotFound();

        item.Note = dto.Note;
        await _context.SaveChangesAsync();
        return Ok(item);
    }
}

public class CreateCollectionDto
{
    public string CollectionName { get; set; } = string.Empty;
}

public class UpdateCollectionDto
{
    public string? Name { get; set; }
    public string? CuratorEssay { get; set; }
    public string? Theme { get; set; }
}

public class AddCollectionItemDto
{
    public string? ArtworkId { get; set; }
    public string? Note { get; set; }
}

public class UpdateItemNoteDto
{
    public string? Note { get; set; }
}
