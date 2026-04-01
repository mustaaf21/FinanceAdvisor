namespace FinanceAdvisor.Application.Models;

public class InsightsSummary
{
    public Dictionary<string, decimal> ThisMonthByCategory { get; set; } = new();
    public Dictionary<string, decimal> LastMonthByCategory { get; set; } = new();
    public Dictionary<string, decimal> PercentageDeltas { get; set; } = new();
    public decimal TotalThisMonth { get; set; }
    public decimal TotalLastMonth { get; set; }
    public string TopCategory { get; set; } = string.Empty;
    public int Month { get; set; }
    public int Year { get; set; }
}

public class RuleAlert
{
    public AlertType Type { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public Severity Severity { get; set; }
}

public enum AlertType
{
    SpendingSpike,
    BudgetWarning,
    RecurringDetected,
    UnusualActivity
}

public enum Severity
{
    Low,
    Medium,
    High
}

public class AIQueryRequest
{
    public string Question { get; set; } = default!;
    public List<ChatMessage>? History { get; set; }
    public object? LastResult { get; set; }
}

public class ChatMessage
{
    public string Role { get; set; } = default!;
    public string Content { get; set; } = default!;
}

public class AgentResponse
{
    public string Answer { get; set; } = string.Empty;
    public List<RuleAlert> Alerts { get; set; } = new();
    public InsightsSummary Summary { get; set; } = null!;
}
