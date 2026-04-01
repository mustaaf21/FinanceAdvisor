using System.Text.Json;
using System.Text.RegularExpressions;
using FinanceAdvisor.Application.DTOs;
using FinanceAdvisor.Application.Interfaces;
using FinanceAdvisor.Application.Models;
using FinanceAdvisor.Infrastructure.External;

namespace FinanceAdvisor.Infrastructure.Services;

public class AIService : IAIService
{
    private readonly GroqClient _groq;

    public AIService(GroqClient groq)
    {
        _groq = groq;
    }

    public async Task<string> QueryAsync(
        string userQuestion,
        InsightsSummary insights,
        List<RuleAlert> alerts,
        List<TransactionDto> recentTransactions,
        List<ChatMessage>? history,
        object? lastResult
    )
    {
        // Key architectural decision: LLM receives ONLY validated structured JSON
        // It never accesses raw transactions or the database directly
        var context = JsonSerializer.Serialize(new
        {
            current_month_spending = insights.ThisMonthByCategory,
            last_month_spending = insights.LastMonthByCategory,
            month_on_month_change_percent = insights.PercentageDeltas,
            total_spent_this_month = insights.TotalThisMonth,
            total_spent_last_month = insights.TotalLastMonth,
            highest_spend_category = insights.TopCategory,
            active_alerts = alerts.Select(a => new { a.Category, a.Message, severity = a.Severity.ToString() }),
            recent_transactions = recentTransactions.Take(10).Select(t => new
            {
                amount = t.Amount,
                category = t.Category,
                description = t.Description,
                date = t.Date.ToString("yyyy-MM-dd"),
                is_recurring = t.IsRecurring
            })
        }, new JsonSerializerOptions { WriteIndented = true });

        var historyText = history != null && history.Any()
            ? string.Join("\n", history.Select(h => $"{h.Role.ToUpper()}: {h.Content}"))
            : "No prior conversation.";

        var lastResultText = lastResult != null
            ? JsonSerializer.Serialize(lastResult, new JsonSerializerOptions { WriteIndented = true })
            : "None";

        var prompt = $"""
            You are a professional financial advisor AI assistant. 
            A user is asking about their personal spending data.
            
            IMPORTANT RULES:
            - Only reference numbers that appear in the JSON data below
            - Do not invent, estimate, or assume any figures
            - Be specific, actionable, and concise (3-5 sentences max)
            - Currency is Indian Rupees (₹)
            - If alerts exist, acknowledge them in your response
            - The data includes recent transactions with amounts, categories, descriptions, and dates
            - You can answer questions about latest transactions, specific amounts, and filtering
            - When showing transaction details, format them clearly with amount, category, and description
            
            CHAT HISTORY:
            {historyText}

            LAST REFERENCED RESULT:
            {lastResultText}

            USER SPENDING DATA:
            {context}
            
            USER QUESTION: {userQuestion}
            
            Respond as a helpful, professional advisor:
            """;

        return await _groq.CompleteAsync(prompt);
    }
}
