using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/site-sections")]
public class SiteSectionsController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public SiteSectionsController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSections()
    {
        var sections = await _context.SiteSections
            .Include(s => s.Items)
            .OrderBy(s => s.SortOrder)
            .Select(s => new
            {
                id = s.Id,
                page = s.Page,
                section = s.Section,
                label = s.Label,
                sortOrder = s.SortOrder,
                isActive = s.IsActive,
                items = s.Items.OrderBy(i => i.SortOrder).Select(i => new
                {
                    id = i.Id,
                    sectionId = i.SectionId,
                    sortOrder = i.SortOrder,
                    isActive = i.IsActive,
                    content = JsonSerializer.Deserialize<object>(i.Content, (JsonSerializerOptions)null)
                })
            })
            .ToListAsync();

        return Ok(sections);
    }

    [HttpPost("{sectionId}/items")]
    [Authorize]
    public async Task<IActionResult> AddItem(string sectionId, [FromBody] AddSectionItemDto dto)
    {
        var section = await _context.SiteSections.FirstOrDefaultAsync(s => s.Id == sectionId);
        if (section == null) return NotFound();

        var item = new SiteSectionItem
        {
            Id = Guid.NewGuid().ToString(),
            SectionId = sectionId,
            SortOrder = dto.SortOrder,
            IsActive = true,
            Content = JsonSerializer.Serialize(dto.Content),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.SiteSectionItems.Add(item);
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }
}

[ApiController]
[Route("api/site-section-items")]
public class SiteSectionItemsController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public SiteSectionItemsController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateItem(string id, [FromBody] UpdateSectionItemDto dto)
    {
        var item = await _context.SiteSectionItems.FirstOrDefaultAsync(i => i.Id == id);
        if (item == null) return NotFound();

        if (dto.Content != null)
            item.Content = JsonSerializer.Serialize(dto.Content);
        if (dto.SortOrder.HasValue)
            item.SortOrder = dto.SortOrder.Value;
        if (dto.IsActive.HasValue)
            item.IsActive = dto.IsActive.Value;
            
        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteItem(string id)
    {
        var item = await _context.SiteSectionItems.FirstOrDefaultAsync(i => i.Id == id);
        if (item == null) return NotFound();

        _context.SiteSectionItems.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }
}

public class AddSectionItemDto
{
    public int SortOrder { get; set; }
    public object? Content { get; set; }
}

public class UpdateSectionItemDto
{
    public int? SortOrder { get; set; }
    public bool? IsActive { get; set; }
    public object? Content { get; set; }
}

