using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UEFGallery.API.Data;
using UEFGallery.API.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
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

    [HttpGet("signin/google")]
    [AllowAnonymous]
    public IActionResult SignInWithGoogle()
    {
        var redirectUrl = Url.Action(nameof(GoogleResponse), "Auth");
        var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("callback/google")]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleResponse()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!result.Succeeded)
            return BadRequest(new { message = "Lỗi xác thực từ Google." });

        var claims = result.Principal?.Identities.FirstOrDefault()?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var picture = claims?.FirstOrDefault(c => c.Type == "urn:google:picture")?.Value 
                      ?? claims?.FirstOrDefault(c => c.Type == "picture")?.Value;

        if (string.IsNullOrEmpty(email))
            return BadRequest(new { message = "Không lấy được email từ Google." });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = email,
                PasswordHash = "", // OAuth users don't have passwords
                FullName = name ?? "Google User",
                AvatarUrl = picture ?? $"https://api.dicebear.com/7.x/avataaars/svg?seed={name?.ToLower()}",
                Role = Role.student,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else if (!user.IsActive)
        {
            return BadRequest(new { message = "Tài khoản của bạn đã bị khóa." });
        }

        var token = GenerateJwtToken(user);
        
        // Redirect to frontend with token
        var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
        return Redirect($"{frontendUrl}/?token={token}");
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

        var jwtString = GenerateJwtToken(user);

        return Ok(new
        {
            Token = jwtString,
            User = new { user.Id, user.Email, user.FullName, user.Role }
        });
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            return BadRequest(new { message = "Email không tồn tại trong hệ thống." });

        // Generate a random 6-digit code or use a fixed one for prototyping
        var code = new Random().Next(100000, 999999).ToString();
        
        user.ResetCode = code;
        user.ResetCodeExpires = DateTime.UtcNow.AddMinutes(15);
        await _context.SaveChangesAsync();

        var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? "smtp.gmail.com";
        var smtpPort = int.TryParse(Environment.GetEnvironmentVariable("SMTP_PORT"), out var port) ? port : 587;
        var smtpUser = Environment.GetEnvironmentVariable("SMTP_USER");
        var smtpPass = Environment.GetEnvironmentVariable("SMTP_PASS");
        var smtpFrom = Environment.GetEnvironmentVariable("SMTP_FROM") ?? "noreply@uef.edu.vn";

        if (!string.IsNullOrEmpty(smtpUser) && !string.IsNullOrEmpty(smtpPass))
        {
            try
            {
                // Parse "Name <email@domain.com>" format
                string fromEmail = smtpFrom;
                string fromName = "UEF Design Gallery";
                if (smtpFrom.Contains("<") && smtpFrom.Contains(">"))
                {
                    var parts = smtpFrom.Split('<');
                    fromName = parts[0].Trim();
                    fromEmail = parts[1].Replace(">", "").Trim();
                }

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromEmail));
                message.To.Add(new MailboxAddress("", dto.Email));
                message.Subject = "Mã xác nhận đặt lại mật khẩu - UEF Design Gallery";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 8px;'>
                            <h2 style='color: #1a4ba8; text-align: center;'>UEF Design Gallery</h2>
                            <h3>Xin chào {user.FullName},</h3>
                            <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.</p>
                            <p>Mã xác nhận của bạn là:</p>
                            <div style='background-color: #f4f6f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1a4ba8; border-radius: 6px; margin: 20px 0;'>
                                {code}
                            </div>
                            <p>Mã này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, xin vui lòng bỏ qua email này.</p>
                            <hr style='border: none; border-top: 1px solid #eaeaec; margin: 20px 0;' />
                            <p style='font-size: 12px; color: #666; text-align: center;'>Đây là email tự động, vui lòng không trả lời.</p>
                        </div>"
                };
                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    // Ignore self-signed certs (e.g., from antivirus/proxy)
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                    await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.Auto);
                    await client.AuthenticateAsync(smtpUser, smtpPass);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                Console.WriteLine($"[EMAIL SENT] Password reset code for {dto.Email}: {code}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EMAIL ERROR] Failed to send email to {dto.Email}: {ex}");
            }
        }
        else
        {
            Console.WriteLine($"[MOCK EMAIL] Password reset code for {dto.Email}: {code}");
        }

        return Ok(new { message = "Mã xác thực đã được gửi." });
    }

    [HttpPost("verify-reset-code")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyResetCode([FromBody] VerifyResetCodeDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            return BadRequest(new { message = "Email không tồn tại." });

        if (user.ResetCode != dto.Code || user.ResetCodeExpires < DateTime.UtcNow)
            return BadRequest(new { message = "Mã xác thực không hợp lệ hoặc đã hết hạn." });

        return Ok(new { message = "Mã xác thực hợp lệ." });
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            return BadRequest(new { message = "Email không tồn tại." });

        if (user.ResetCode != dto.Code || user.ResetCodeExpires < DateTime.UtcNow)
            return BadRequest(new { message = "Mã xác thực không hợp lệ hoặc đã hết hạn." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user.ResetCode = null;
        user.ResetCodeExpires = null;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đặt lại mật khẩu thành công." });
    }

    private string GenerateJwtToken(User user)
    {
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
        return tokenHandler.WriteToken(token);
    }
}

public class RegisterDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string FullName { get; set; }
    public string? Role { get; set; }
}

public class ForgotPasswordDto
{
    public required string Email { get; set; }
}

public class VerifyResetCodeDto
{
    public required string Email { get; set; }
    public required string Code { get; set; }
}

public class ResetPasswordDto
{
    public required string Email { get; set; }
    public required string Code { get; set; }
    public required string Password { get; set; }
}

public class LoginDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}
