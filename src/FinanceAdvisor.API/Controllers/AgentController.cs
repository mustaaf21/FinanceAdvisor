using System.Security.Claims;
using FinanceAdvisor.Application.Interfaces;
using FinanceAdvisor.Application.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAdvisor.API.Controllers;

[ApiController]
[Route("api/agent")]
[Authorize]
public class AgentController : ControllerBase
{
    private readonly IInsightsService _insights;
    private readonly IRulesEngineService _rules;
    private readonly IAIService _ai;

    public AgentController(
        IInsightsService insights,
        IRulesEngineService rules,
        IAIService ai)
    {
        _insights = insights;
        _rules = rules;
        _ai = ai;
    }

    /// <summary>
    /// Two-agent orchestration:
    /// Agent 1 (Data Processor): deterministic aggregation + rules evaluation
    /// Agent 2 (Financial Advisor): LLM reasoning over structured JSON only
    /// </summary>
    [HttpPost("query")]
    public async Task<IActionResult> Query([FromBody] AIQueryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Question))
            return BadRequest(new { message = "Question cannot be empty" });

        var userId = GetUserId();

        // === AGENT 1: Data Processor (deterministic, no LLM) ===
        var summary = await _insights.GetSummaryAsync(userId);
        var alerts = _rules.Evaluate(summary);

        // === AGENT 2: Financial Advisor (LLM, controlled input) ===
        var answer = await _ai.QueryAsync(request.Question, summary, alerts);

        return Ok(new AgentResponse
        {
            Answer = answer,
            Alerts = alerts,
            Summary = summary
        });
    }

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}
