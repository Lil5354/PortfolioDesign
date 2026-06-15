using CloudinaryDotNet;
using Microsoft.AspNetCore.Mvc;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public UploadController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("signature")]
    public IActionResult GetSignature([FromQuery] string? folder)
    {
        var cloudName = _configuration["Cloudinary:CloudName"] ?? Environment.GetEnvironmentVariable("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
        var apiKey = _configuration["Cloudinary:ApiKey"] ?? Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
        var apiSecret = _configuration["Cloudinary:ApiSecret"] ?? Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");

        if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
        {
            return StatusCode(500, new { error = "Cloudinary not configured" });
        }

        var cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));

        var timestamp = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds;
        var folderToUse = string.IsNullOrEmpty(folder) ? "artworks" : folder;

        var parameters = new Dictionary<string, object>
        {
            { "timestamp", timestamp },
            { "source", "uw" },
            { "folder", folderToUse }
        };

        var signature = cloudinary.Api.SignParameters(parameters);

        return Ok(new
        {
            timestamp,
            signature,
            cloudName,
            apiKey,
            folder = folderToUse
        });
    }
}
