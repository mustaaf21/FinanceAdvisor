using FinanceAdvisor.Application.DTOs;
using FinanceAdvisor.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAdvisor.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _auth.LoginAsync(request);
        if (result == null)
            return Unauthorized(new { message = "Invalid email or password" });

        return Ok(result);
    }

    [HttpPost("check-session")]
    public async Task<IActionResult> CheckSession([FromBody] SessionCheckRequest request)
    {
        var result = await _auth.CheckActiveSessionAsync(request.Email);
        return Ok(result);
    }

    [HttpPost("logout-session")]
    public async Task<IActionResult> LogoutSession([FromQuery] string sessionId)
    {
        await _auth.LogoutSessionAsync(sessionId);
        return Ok(new { message = "Session logged out successfully" });
    }
}
