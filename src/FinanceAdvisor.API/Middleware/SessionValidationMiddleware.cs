using System.Security.Claims;
using FinanceAdvisor.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FinanceAdvisor.API.Middleware;

public class SessionValidationMiddleware
{
    private readonly RequestDelegate _next;

    public SessionValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        // Skip validation for auth endpoints and non-authenticated requests
        if (context.Request.Path.StartsWithSegments("/api/auth") || 
            !context.User.Identity?.IsAuthenticated == true)
        {
            await _next(context);
            return;
        }

        // Get session ID from header
        var sessionId = context.Request.Headers["X-Session-Id"].FirstOrDefault();
        
        if (string.IsNullOrEmpty(sessionId))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { message = "Session ID required" });
            return;
        }

        // Validate session is still active
        var session = await db.UserSessions
            .FirstOrDefaultAsync(s => s.SessionToken == sessionId);

        if (session == null || !session.IsActive)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { message = "Session expired or invalid" });
            return;
        }

        // Check if session is within 5-minute activity window
        if (session.LastActivityAt < DateTime.UtcNow.AddMinutes(-5))
        {
            session.IsActive = false;
            await db.SaveChangesAsync();
            
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { message = "Session timed out" });
            return;
        }

        // Update last activity timestamp
        session.LastActivityAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        await _next(context);
    }
}
