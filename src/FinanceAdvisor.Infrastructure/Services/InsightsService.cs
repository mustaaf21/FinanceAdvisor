using FinanceAdvisor.Application.Interfaces;
using FinanceAdvisor.Application.Models;
using FinanceAdvisor.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FinanceAdvisor.Infrastructure.Services;

public class InsightsService : IInsightsService
{
    private readonly AppDbContext _db;

    public InsightsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<InsightsSummary> GetSummaryAsync(int userId)
    {
        var now = DateTime.UtcNow;
        var thisMonth = now.Month;
        var lastMonth = now.AddMonths(-1).Month;
        var lastMonthYear = now.AddMonths(-1).Year;

        var transactions = await _db.Transactions
            .Where(t => t.UserId == userId &&
                       ((t.Date.Year == now.Year && t.Date.Month == thisMonth) ||
                        (t.Date.Year == lastMonthYear && t.Date.Month == lastMonth)))
            .ToListAsync();

        var thisMonthSpend = transactions
            .Where(t => t.Date.Month == thisMonth && t.Date.Year == now.Year)
            .GroupBy(t => t.Category.ToString())
            .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

        var lastMonthSpend = transactions
            .Where(t => t.Date.Month == lastMonth && t.Date.Year == lastMonthYear)
            .GroupBy(t => t.Category.ToString())
            .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

        var allCategories = thisMonthSpend.Keys.Union(lastMonthSpend.Keys);

        var deltas = allCategories.ToDictionary(
            cat => cat,
            cat =>
            {
                var current = thisMonthSpend.GetValueOrDefault(cat, 0);
                var previous = lastMonthSpend.GetValueOrDefault(cat, 0);
                if (previous == 0) return current > 0 ? 100m : 0m;
                return Math.Round(((current - previous) / previous) * 100, 1);
            }
        );

        var topCategory = thisMonthSpend.Count > 0
            ? thisMonthSpend.MaxBy(k => k.Value).Key
            : "None";

        return new InsightsSummary
        {
            ThisMonthByCategory = thisMonthSpend,
            LastMonthByCategory = lastMonthSpend,
            PercentageDeltas = deltas,
            TotalThisMonth = thisMonthSpend.Values.Sum(),
            TotalLastMonth = lastMonthSpend.Values.Sum(),
            TopCategory = topCategory,
            Month = thisMonth,
            Year = now.Year
        };
    }
}
