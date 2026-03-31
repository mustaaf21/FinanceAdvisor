using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FinanceAdvisor.Application.DTOs;
using FinanceAdvisor.Application.Interfaces;
using FinanceAdvisor.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FinanceAdvisor.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users
            .Include(u => u.Sessions)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null) return null;

        var hash = HashPassword(request.Password);
        if (hash != user.PasswordHash) return null;

        // Check for active sessions (within last 5 minutes)
        var activeSessions = user.Sessions
            .Where(s => s.IsActive && s.LastActivityAt > DateTime.UtcNow.AddMinutes(-5))
            .ToList();

        if (activeSessions.Any() && !request.ForceLogoutOthers)
        {
            // Return response indicating active session exists
            return new LoginResponse("", user.FullName, user.Email, true, activeSessions.First().SessionToken);
        }

        // Force logout other sessions if requested
        if (request.ForceLogoutOthers)
        {
            foreach (var session in activeSessions)
            {
                session.IsActive = false;
            }
        }

        // Create new session
        var token = GenerateJwt(user.Id, user.Email);
        var sessionToken = Guid.NewGuid().ToString();
        
        var newSession = new Domain.Entities.UserSession
        {
            UserId = user.Id,
            SessionToken = sessionToken,
            CreatedAt = DateTime.UtcNow,
            LastActivityAt = DateTime.UtcNow,
            IsActive = true
        };

        _db.UserSessions.Add(newSession);
        await _db.SaveChangesAsync();

        return new LoginResponse(token, user.FullName, user.Email, false, sessionToken);
    }

    private string GenerateJwt(int userId, string email)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<SessionCheckResponse> CheckActiveSessionAsync(string email)
    {
        var user = await _db.Users
            .Include(u => u.Sessions)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null) return new SessionCheckResponse(false);

        var activeSession = user.Sessions
            .FirstOrDefault(s => s.IsActive && s.LastActivityAt > DateTime.UtcNow.AddMinutes(-5));

        return new SessionCheckResponse(activeSession != null, activeSession?.SessionToken);
    }

    public async Task LogoutSessionAsync(string sessionId)
    {
        var session = await _db.UserSessions
            .FirstOrDefaultAsync(s => s.SessionToken == sessionId);

        if (session != null)
        {
            session.IsActive = false;
            await _db.SaveChangesAsync();
        }
    }

    public async Task UpdateSessionActivityAsync(int userId, string sessionToken)
    {
        var session = await _db.UserSessions
            .FirstOrDefaultAsync(s => s.UserId == userId && s.SessionToken == sessionToken && s.IsActive);

        if (session != null)
        {
            session.LastActivityAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    public static string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}
