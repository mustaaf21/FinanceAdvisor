using FinanceAdvisor.Application.DTOs;
using FinanceAdvisor.Application.Models;
using FinanceAdvisor.Domain.Entities;

namespace FinanceAdvisor.Application.Interfaces;

public interface ITransactionService
{
    Task<List<TransactionDto>> GetByUserAsync(int userId);
    Task<TransactionDto> AddAsync(int userId, AddTransactionRequest request);
    Task<TransactionDto> UpdateAsync(int userId, int transactionId, UpdateTransactionRequest request);
    Task<TransactionDto?> GetLatestAsync(int userId);
    Task<List<TransactionDto>> GetByAmountRangeAsync(int userId, decimal minAmount, decimal? maxAmount = null);
}

public interface IInsightsService
{
    Task<InsightsSummary> GetSummaryAsync(int userId);
}

public interface IRulesEngineService
{
    List<RuleAlert> Evaluate(InsightsSummary summary);
}

public interface IAIService
{
    Task<string> QueryAsync(
        string userQuestion,
        InsightsSummary insights,
        List<RuleAlert> alerts,
        List<TransactionDto> recentTransactions,
        List<ChatMessage>? history,
        object? lastResult
    );
}
public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<SessionCheckResponse> CheckActiveSessionAsync(string email);
    Task LogoutSessionAsync(string sessionId);
    Task UpdateSessionActivityAsync(int userId, string sessionToken);
}
