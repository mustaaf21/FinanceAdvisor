using FinanceAdvisor.Application.DTOs;
using FinanceAdvisor.Application.Interfaces;
using FinanceAdvisor.Domain.Entities;
using FinanceAdvisor.Domain.Enums;
using FinanceAdvisor.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FinanceAdvisor.Infrastructure.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _db;

    public TransactionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TransactionDto>> GetByUserAsync(int userId)
    {
        return await _db.Transactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date).ThenByDescending(t => t.Id)
            .Select(t => new TransactionDto(
                t.Id,
                t.Amount,
                t.Category.ToString(),
                t.Description,
                t.Date,
                t.IsRecurring
            ))
            .ToListAsync();
    }

    public async Task<TransactionDto> AddAsync(int userId, AddTransactionRequest request)
    {
        if (!Enum.TryParse<Category>(request.Category, true, out var category))
            category = Category.Other;

        var transaction = new Transaction
        {
            UserId = userId,
            Amount = request.Amount,
            Category = category,
            Description = request.Description,
            Date = request.Date,
            IsRecurring = request.IsRecurring
        };

        _db.Transactions.Add(transaction);
        await _db.SaveChangesAsync();

        return new TransactionDto(
            transaction.Id,
            transaction.Amount,
            transaction.Category.ToString(),
            transaction.Description,
            transaction.Date,
            transaction.IsRecurring
        );
    }

    public async Task<TransactionDto> UpdateAsync(int userId, int transactionId, UpdateTransactionRequest request)
    {
        var transaction = await _db.Transactions
            .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId);

        if (transaction == null)
            throw new InvalidOperationException("Transaction not found or access denied");

        if (!Enum.TryParse<Category>(request.Category, true, out var category))
            category = Category.Other;

        transaction.Amount = request.Amount;
        transaction.Category = category;
        transaction.Description = request.Description;
        transaction.Date = request.Date;
        transaction.IsRecurring = request.IsRecurring;

        await _db.SaveChangesAsync();

        return new TransactionDto(
            transaction.Id,
            transaction.Amount,
            transaction.Category.ToString(),
            transaction.Description,
            transaction.Date,
            transaction.IsRecurring
        );
    }

    public async Task<TransactionDto?> GetLatestAsync(int userId)
    {
        var transaction = await _db.Transactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date).ThenByDescending(t => t.Id)
            .FirstOrDefaultAsync();

        if (transaction == null) return null;

        return new TransactionDto(
            transaction.Id,
            transaction.Amount,
            transaction.Category.ToString(),
            transaction.Description,
            transaction.Date,
            transaction.IsRecurring
        );
    }

    public async Task<List<TransactionDto>> GetByAmountRangeAsync(int userId, decimal minAmount, decimal? maxAmount = null)
    {
        var query = _db.Transactions
            .Where(t => t.UserId == userId && t.Amount >= minAmount);

        if (maxAmount.HasValue)
            query = query.Where(t => t.Amount <= maxAmount.Value);

        return await query
            .OrderByDescending(t => t.Date).ThenByDescending(t => t.Id)
            .Select(t => new TransactionDto(
                t.Id,
                t.Amount,
                t.Category.ToString(),
                t.Description,
                t.Date,
                t.IsRecurring
            ))
            .ToListAsync();
    }
}
