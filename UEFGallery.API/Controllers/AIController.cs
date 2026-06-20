using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using UEFGallery.API.Services;

namespace UEFGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly GeminiService _geminiService;

    public AIController(GeminiService geminiService)
    {
        _geminiService = geminiService;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Message))
            return BadRequest(new { error = "Message is required." });

        try
        {
            var reply = await _geminiService.ChatAsync(request.Message, request.Role, request.History ?? new List<GeminiMessage>());
            return Ok(new { reply });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("analyze-artwork")]
    public async Task<IActionResult> AnalyzeArtwork([FromBody] AnalyzeArtworkRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.ImageBase64))
            return BadRequest(new { error = "Image is required." });

        try
        {
            var result = await _geminiService.AnalyzeArtworkAsync(request.ImageBase64);
            return Ok(result);
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public class ChatRequest
{
    public string Message { get; set; }
    public string SessionId { get; set; }
    public string Role { get; set; }
    public List<GeminiMessage> History { get; set; }
}

public class AnalyzeArtworkRequest
{
    public string ImageBase64 { get; set; }
}
