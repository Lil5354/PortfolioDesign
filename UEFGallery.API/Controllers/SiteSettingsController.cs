using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/site-settings")]
public class SiteSettingsController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public SiteSettingsController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.SiteSettings.ToListAsync();
        var dict = settings.ToDictionary(s => s.Key, s => s.Value);
        return Ok(dict);
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateSetting([FromBody] UpdateSettingDto dto)
    {
        var setting = await _context.SiteSettings.FirstOrDefaultAsync(s => s.Key == dto.Key);
        if (setting == null)
        {
            setting = new SiteSetting
            {
                Id = Guid.NewGuid().ToString(),
                Key = dto.Key,
                Value = dto.Value,
                Type = "string"
            };
            _context.SiteSettings.Add(setting);
        }
        else
        {
            setting.Value = dto.Value;
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }
}

public class UpdateSettingDto
{
    public required string Key { get; set; }
    public string? Value { get; set; }
}
