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
            .OrderByDescending(t => t.Date)
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
}
