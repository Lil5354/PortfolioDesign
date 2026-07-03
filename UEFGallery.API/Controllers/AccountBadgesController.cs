using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UEFGallery.API.Data;
using UEFGallery.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UEFGallery.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountBadgesController : ControllerBase
    {
        private readonly GalleryDbContext _context;

        public AccountBadgesController(GalleryDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAccountBadges()
        {
            try { 
                await _context.Database.ExecuteSqlRawAsync(@"
                    CREATE TABLE IF NOT EXISTS account_badges (
                        account_badge_id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        icon_url TEXT,
                        text_color TEXT,
                        bg_color TEXT,
                        tooltip TEXT,
                        type TEXT,
                        condition TEXT,
                        created_at TEXT
                    );
                ");
                await _context.Database.ExecuteSqlRawAsync(@"
                    CREATE TABLE IF NOT EXISTS user_account_badges (
                        user_id TEXT,
                        account_badge_id TEXT,
                        assigned_at TEXT,
                        PRIMARY KEY (user_id, account_badge_id)
                    );
                ");
                await _context.Database.ExecuteSqlRawAsync("ALTER TABLE account_badges ADD COLUMN bg_color TEXT DEFAULT '#1A4BA8'"); 
                await _context.Database.ExecuteSqlRawAsync("ALTER TABLE account_badges ADD COLUMN text_color TEXT DEFAULT '#FFFFFF'"); 
            } catch { }

            var defaultBadgesCount = await _context.AccountBadges.CountAsync(b => b.Type == "Default");
            if (defaultBadgesCount == 0)
            {
                var defaults = new List<AccountBadge>
                {
                    new AccountBadge { Id = Guid.NewGuid(), Name = "Designer Mầm non", Tooltip = "Sinh viên Năm 1", BgColor = "#ffffff", TextColor = "#84cc16", Type = "Default", Condition = "Năm 1", CreatedAt = DateTime.UtcNow },
                    new AccountBadge { Id = Guid.NewGuid(), Name = "Designer Thực tập", Tooltip = "Sinh viên Năm 2", BgColor = "#ffffff", TextColor = "#22c55e", Type = "Default", Condition = "Năm 2", CreatedAt = DateTime.UtcNow },
                    new AccountBadge { Id = Guid.NewGuid(), Name = "Designer Chuyên nghiệp", Tooltip = "Sinh viên Năm 3", BgColor = "#ffffff", TextColor = "#166534", Type = "Default", Condition = "Năm 3", CreatedAt = DateTime.UtcNow },
                    new AccountBadge { Id = Guid.NewGuid(), Name = "Designer Tiền bối", Tooltip = "Sinh viên Năm cuối", BgColor = "#ffffff", TextColor = "#f59e0b", Type = "Default", Condition = "Năm cuối", CreatedAt = DateTime.UtcNow },
                    new AccountBadge { Id = Guid.NewGuid(), Name = "Designer Tốt nghiệp", Tooltip = "Cựu sinh viên Tốt nghiệp", BgColor = "#ffffff", TextColor = "#000000", Type = "Default", Condition = "Tốt nghiệp", CreatedAt = DateTime.UtcNow }
                };
                _context.AccountBadges.AddRange(defaults);
                await _context.SaveChangesAsync();
            }

            var badges = await _context.AccountBadges.OrderByDescending(b => b.CreatedAt).ToListAsync();
            return Ok(badges);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBadge([FromBody] AccountBadge dto)
        {
            if (string.IsNullOrEmpty(dto.Name)) return BadRequest("Name is required");

            var badge = new AccountBadge
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                IconUrl = dto.IconUrl,
                TextColor = !string.IsNullOrEmpty(dto.TextColor) ? dto.TextColor : "#FFFFFF",
                BgColor = !string.IsNullOrEmpty(dto.BgColor) ? dto.BgColor : "#1A4BA8",
                Tooltip = dto.Tooltip,
                Type = dto.Type ?? "Custom",
                Condition = dto.Condition,
                CreatedAt = DateTime.UtcNow
            };

            _context.AccountBadges.Add(badge);
            await _context.SaveChangesAsync();

            return Ok(badge);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBadge(Guid id, [FromBody] AccountBadge dto)
        {
            var badge = await _context.AccountBadges.FindAsync(id);
            if (badge == null) return NotFound();

            badge.Name = dto.Name;
            badge.IconUrl = dto.IconUrl;
            badge.TextColor = dto.TextColor;
            badge.BgColor = dto.BgColor;
            badge.Tooltip = dto.Tooltip;
            badge.Type = dto.Type;
            badge.Condition = dto.Condition;

            await _context.SaveChangesAsync();
            return Ok(badge);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBadge(Guid id)
        {
            var badge = await _context.AccountBadges.FindAsync(id);
            if (badge == null) return NotFound();

            var assignments = await _context.UserAccountBadges.Where(u => u.AccountBadgeId == id).ToListAsync();
            _context.UserAccountBadges.RemoveRange(assignments);

            _context.AccountBadges.Remove(badge);
            await _context.SaveChangesAsync();
            return Ok(new { status = "deleted" });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserBadges(string userId)
        {
            try { 
                await _context.Database.ExecuteSqlRawAsync(@"CREATE TABLE IF NOT EXISTS account_badges (account_badge_id TEXT PRIMARY KEY, name TEXT NOT NULL, icon_url TEXT, text_color TEXT, bg_color TEXT, tooltip TEXT, type TEXT, condition TEXT, created_at TEXT);");
                await _context.Database.ExecuteSqlRawAsync(@"CREATE TABLE IF NOT EXISTS user_account_badges (user_id TEXT, account_badge_id TEXT, assigned_at TEXT, PRIMARY KEY (user_id, account_badge_id));");
            } catch { }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return NotFound();

            // Explicitly assigned badges
            var assignedBadges = await _context.UserAccountBadges
                .Where(uab => uab.UserId == userId)
                .Select(uab => uab.AccountBadge)
                .ToListAsync();

            // Dynamic evaluation for Default badges based on condition
            var defaultBadges = await _context.AccountBadges.Where(b => b.Type == "Default").ToListAsync();
            foreach(var db in defaultBadges)
            {
                if (!string.IsNullOrEmpty(db.Condition))
                {
                    bool conditionMet = false;
                    // Evaluate conditions, e.g., "Năm 1"
                    if (db.Condition.Equals("Năm 1", StringComparison.OrdinalIgnoreCase) && user.Cohort == "Năm 1") conditionMet = true;
                    if (db.Condition.Equals("Năm 2", StringComparison.OrdinalIgnoreCase) && user.Cohort == "Năm 2") conditionMet = true;
                    if (db.Condition.Equals("Năm 3", StringComparison.OrdinalIgnoreCase) && user.Cohort == "Năm 3") conditionMet = true;
                    if (db.Condition.Equals("Năm 4", StringComparison.OrdinalIgnoreCase) && user.Cohort == "Năm 4") conditionMet = true;
                    if (db.Condition.Equals("Năm cuối", StringComparison.OrdinalIgnoreCase) && (user.Cohort == "Năm cuối" || user.Cohort == "Năm 4")) conditionMet = true;
                    if (db.Condition.Equals("Giảng viên", StringComparison.OrdinalIgnoreCase) && user.Role == Role.lecturer) conditionMet = true;

                    if (conditionMet && !assignedBadges.Any(b => b.Id == db.Id))
                    {
                        assignedBadges.Add(db);
                    }
                }
            }

            return Ok(assignedBadges);
        }

        [HttpPost("{badgeId}/assign/{userId}")]
        public async Task<IActionResult> ToggleAssignBadge(Guid badgeId, string userId)
        {
            var exists = await _context.UserAccountBadges.AnyAsync(ab => ab.AccountBadgeId == badgeId && ab.UserId == userId);
            if (exists)
            {
                var ab = await _context.UserAccountBadges.FirstAsync(a => a.AccountBadgeId == badgeId && a.UserId == userId);
                _context.UserAccountBadges.Remove(ab);
                await _context.SaveChangesAsync();
                return Ok(new { status = "removed" });
            }
            else
            {
                var newAb = new UserAccountBadge
                {
                    AccountBadgeId = badgeId,
                    UserId = userId,
                    AssignedAt = DateTime.UtcNow
                };
                _context.UserAccountBadges.Add(newAb);
                await _context.SaveChangesAsync();
                return Ok(new { status = "assigned" });
            }
        }
    }
}
