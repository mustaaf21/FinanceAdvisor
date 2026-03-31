using FinanceAdvisor.Application.Interfaces;
using FinanceAdvisor.Application.Models;

namespace FinanceAdvisor.Application.Services;

public class RulesEngineService : IRulesEngineService
{
    private const decimal BudgetWarningThreshold = 50000m;
    private const decimal SpendingSpikePercent = 20m;
    private const decimal HighSpikePercent = 50m;

    public List<RuleAlert> Evaluate(InsightsSummary summary)
    {
        var alerts = new List<RuleAlert>();

        // Rule 1: Spending spike per category
        foreach (var (category, delta) in summary.PercentageDeltas)
        {
            if (delta > SpendingSpikePercent)
            {
                alerts.Add(new RuleAlert
                {
                    Type = AlertType.SpendingSpike,
                    Category = category,
                    Message = $"{category} spending increased by {delta}% compared to last month",
                    Severity = delta > HighSpikePercent ? Severity.High : Severity.Medium
                });
            }
        }

        // Rule 2: Total monthly budget warning
        if (summary.TotalThisMonth > BudgetWarningThreshold)
        {
            alerts.Add(new RuleAlert
            {
                Type = AlertType.BudgetWarning,
                Category = "Overall",
                Message = $"Total monthly spend of ₹{summary.TotalThisMonth:N0} exceeds recommended threshold",
                Severity = Severity.High
            });
        }

        // Rule 3: Month-on-month total spike
        if (summary.TotalLastMonth > 0)
        {
            var totalDelta = ((summary.TotalThisMonth - summary.TotalLastMonth) / summary.TotalLastMonth) * 100;
            if (totalDelta > 30)
            {
                alerts.Add(new RuleAlert
                {
                    Type = AlertType.UnusualActivity,
                    Category = "Overall",
                    Message = $"Overall spending up {Math.Round(totalDelta, 1)}% from last month — review your budget",
                    Severity = Severity.Medium
                });
            }
        }

        return alerts;
    }
}
