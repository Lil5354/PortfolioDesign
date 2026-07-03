using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UEFGallery.API.Data;
using UEFGallery.API.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace UEFGallery.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BadgesController : ControllerBase
    {
        private readonly GalleryDbContext _context;

        public BadgesController(GalleryDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBadges([FromQuery] string lecturerId)
        {
            var query = _context.Badges.AsQueryable();
            if (!string.IsNullOrEmpty(lecturerId))
            {
                query = query.Where(b => b.LecturerId == lecturerId);
            }
            var badges = await query.OrderByDescending(b => b.CreatedAt).ToListAsync();
            return Ok(badges);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBadge([FromBody] Badge dto)
        {
            if (string.IsNullOrEmpty(dto.Name)) return BadRequest("Name is required");
            if (string.IsNullOrEmpty(dto.LecturerId)) return BadRequest("LecturerId is required");

            var badge = new Badge
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                ColorCode = dto.ColorCode,
                TextColor = !string.IsNullOrEmpty(dto.TextColor) ? dto.TextColor : "#FFFFFF",
                LecturerId = dto.LecturerId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Badges.Add(badge);
            await _context.SaveChangesAsync();

            return Ok(badge);
        }

        [HttpPost("{badgeId}/assign/{artworkId}")]
        public async Task<IActionResult> AssignBadge(Guid badgeId, string artworkId)
        {
            var exists = await _context.ArtworkBadges.AnyAsync(ab => ab.BadgeId == badgeId && ab.ArtworkId == artworkId);
            if (exists)
            {
                // Already assigned, we can toggle (remove)
                var ab = await _context.ArtworkBadges.FirstAsync(a => a.BadgeId == badgeId && a.ArtworkId == artworkId);
                _context.ArtworkBadges.Remove(ab);
                await _context.SaveChangesAsync();
                return Ok(new { status = "removed" });
            }
            else
            {
                var newAb = new ArtworkBadge
                {
                    BadgeId = badgeId,
                    ArtworkId = artworkId,
                    AssignedAt = DateTime.UtcNow
                };
                _context.ArtworkBadges.Add(newAb);
                await _context.SaveChangesAsync();
                return Ok(new { status = "assigned" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBadge(Guid id, [FromBody] Badge dto)
        {
            if (string.IsNullOrEmpty(dto.Name)) return BadRequest("Name is required");
            if (string.IsNullOrEmpty(dto.LecturerId)) return BadRequest("LecturerId is required");

            var badge = await _context.Badges.FirstOrDefaultAsync(b => b.Id == id && b.LecturerId == dto.LecturerId);
            if (badge == null)
            {
                return NotFound("Badge not found or you don't have permission to edit it.");
            }

            badge.Name = dto.Name;
            badge.ColorCode = dto.ColorCode;
            badge.TextColor = !string.IsNullOrEmpty(dto.TextColor) ? dto.TextColor : "#FFFFFF";

            await _context.SaveChangesAsync();

            return Ok(badge);
        }

        [HttpDelete("{badgeId}")]
        public async Task<IActionResult> DeleteBadge(Guid badgeId, [FromQuery] string lecturerId)
        {
            var badge = await _context.Badges.FirstOrDefaultAsync(b => b.Id == badgeId && b.LecturerId == lecturerId);
            if (badge == null)
            {
                return NotFound("Badge not found or you don't have permission to delete it.");
            }

            // Remove assigned references first
            var assignments = await _context.ArtworkBadges.Where(ab => ab.BadgeId == badgeId).ToListAsync();
            _context.ArtworkBadges.RemoveRange(assignments);

            // Remove the badge
            _context.Badges.Remove(badge);
            await _context.SaveChangesAsync();

            return Ok(new { status = "deleted" });
        }
    }
}
