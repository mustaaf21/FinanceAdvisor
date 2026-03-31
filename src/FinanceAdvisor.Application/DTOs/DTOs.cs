namespace FinanceAdvisor.Application.DTOs;

public record LoginRequest(string Email, string Password, bool ForceLogoutOthers = false);

public record LoginResponse(string Token, string FullName, string Email, bool HasActiveSession = false, string? SessionId = null);

public record AddTransactionRequest(
    decimal Amount,
    string Category,
    string Description,
    DateTime Date,
    bool IsRecurring
);

public record TransactionDto(
    int Id,
    decimal Amount,
    string Category,
    string Description,
    DateTime Date,
    bool IsRecurring
);

public record UpdateTransactionRequest(
    decimal Amount,
    string Category,
    string Description,
    DateTime Date,
    bool IsRecurring
);

public record SessionCheckRequest(string Email);

public record SessionCheckResponse(bool HasActiveSession, string? SessionId = null);
