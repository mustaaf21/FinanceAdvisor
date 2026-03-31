using FinanceAdvisor.Application.DTOs;
using FinanceAdvisor.Application.Models;
using FinanceAdvisor.Domain.Entities;

namespace FinanceAdvisor.Application.Interfaces;

public interface ITransactionService
{
    Task<List<TransactionDto>> GetByUserAsync(int userId);
    Task<TransactionDto> AddAsync(int userId, AddTransactionRequest request);
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
    Task<string> QueryAsync(string userQuestion, InsightsSummary insights, List<RuleAlert> alerts);
}

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}
