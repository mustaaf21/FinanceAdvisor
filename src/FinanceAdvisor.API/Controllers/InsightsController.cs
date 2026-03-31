using System.Security.Claims;
using FinanceAdvisor.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAdvisor.API.Controllers;

[ApiController]
[Route("api/insights")]
[Authorize]
public class InsightsController : ControllerBase
{
    private readonly IInsightsService _insights;
    private readonly IRulesEngineService _rules;

    public InsightsController(IInsightsService insights, IRulesEngineService rules)
    {
        _insights = insights;
        _rules = rules;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = GetUserId();
        var summary = await _insights.GetSummaryAsync(userId);
        var alerts = _rules.Evaluate(summary);

        return Ok(new { summary, alerts });
    }

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}
