using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly GalleryDbContext _context;

    public OrdersController(GalleryDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return Unauthorized();

        IQueryable<Message> query = _context.Messages.Where(m => m.Purpose == "order");

        if (user.Role == Role.admin)
        {
            // Admin sees all orders
        }
        else if (user.Role == Role.lecturer)
        {
            // Lecturer sees orders sent to them
            query = query.Where(m => m.RecipientId == userId);
        }
        else
        {
            // Student sees orders sent to them
            query = query.Where(m => m.RecipientId == userId);
        }

        var orders = await query
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return Ok(new { orders = orders });
    }
}
