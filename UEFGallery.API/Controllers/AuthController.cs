using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UEFGallery.API.Data;
using UEFGallery.API.Models;
using BCrypt.Net;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly GalleryDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(GalleryDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "Email đã tồn tại trong hệ thống." });

        if (!Enum.TryParse<Role>(dto.Role, true, out var role))
        {
            role = Role.student;
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FullName = dto.FullName,
            Role = role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đăng ký thành công", userId = user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        
        bool isPasswordValid = false;
        try
        {
            if (user != null && !string.IsNullOrEmpty(user.PasswordHash))
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
                
                // Fallback for plaintext passwords in the database during prototyping
                if (!isPasswordValid && user.PasswordHash == dto.Password)
                {
                    isPasswordValid = true;
                }
            }
        }
        catch
        {
            // If PasswordHash is an invalid bcrypt format, check if it matches plaintext (for testing)
            if (user != null && user.PasswordHash == dto.Password)
            {
                isPasswordValid = true;
            }
        }

        if (user == null || !isPasswordValid)
            return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác." });

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"] ?? "your_super_secret_key_that_is_long_enough");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("FullName", user.FullName ?? "")
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwtString = tokenHandler.WriteToken(token);

        return Ok(new
        {
            Token = jwtString,
            User = new { user.Id, user.Email, user.FullName, user.Role }
        });
    }
}

public class RegisterDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string FullName { get; set; }
    public string? Role { get; set; }
}

public class LoginDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}
