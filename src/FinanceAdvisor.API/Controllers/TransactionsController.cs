using System.Security.Claims;
using FinanceAdvisor.Application.DTOs;
using FinanceAdvisor.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAdvisor.API.Controllers;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactions;

    public TransactionsController(ITransactionService transactions)
    {
        _transactions = transactions;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var result = await _transactions.GetByUserAsync(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddTransactionRequest request)
    {
        var userId = GetUserId();
        var result = await _transactions.AddAsync(userId, request);
        return CreatedAtAction(nameof(GetAll), result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTransactionRequest request)
    {
        var userId = GetUserId();
        try
        {
            var result = await _transactions.UpdateAsync(userId, id, request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("latest")]
    public async Task<IActionResult> GetLatest()
    {
        var userId = GetUserId();
        var result = await _transactions.GetLatestAsync(userId);
        if (result == null)
            return NotFound(new { message = "No transactions found" });
        return Ok(result);
    }

    [HttpGet("by-amount")]
    public async Task<IActionResult> GetByAmount([FromQuery] decimal minAmount, [FromQuery] decimal? maxAmount = null)
    {
        var userId = GetUserId();
        var result = await _transactions.GetByAmountRangeAsync(userId, minAmount, maxAmount);
        return Ok(result);
    }

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}
