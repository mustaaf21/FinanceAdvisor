using System.Security.Cryptography;
using System.Text;
using FinanceAdvisor.Domain.Entities;
using FinanceAdvisor.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FinanceAdvisor.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<UserSession> UserSessions => Set<UserSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.User)
            .WithMany(u => u.Transactions)
            .HasForeignKey(t => t.UserId);

        modelBuilder.Entity<Transaction>()
            .Property(t => t.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<UserSession>()
            .HasOne(s => s.User)
            .WithMany(u => u.Sessions)
            .HasForeignKey(s => s.UserId);

        var hash = HashPassword("Your_password");

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Email = "mustafeez@demo.com",
                FullName = "Mustafeez Khan",
                PasswordHash = hash,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        // Seed sample transactions for demo
        var now = DateTime.UtcNow;
        var transactions = new List<Transaction>();
        var categories = new[] { Category.Food, Category.Transport, Category.Entertainment, Category.Utilities, Category.Shopping };
        var descriptions = new Dictionary<Category, string[]>
        {
            [Category.Food] = new[] { "Swiggy Order", "Zomato Dinner", "Grocery Store", "Restaurant Lunch" },
            [Category.Transport] = new[] { "Uber Ride", "Ola Cab", "Fuel", "Metro Pass" },
            [Category.Entertainment] = new[] { "Netflix", "Movie Tickets", "Concert", "Spotify" },
            [Category.Utilities] = new[] { "Electricity Bill", "Internet Bill", "Mobile Recharge", "Water Bill" },
            [Category.Shopping] = new[] { "Amazon Purchase", "Flipkart Order", "Clothing", "Electronics" }
        };

        var rnd = new Random(42);
        int id = 1;

        foreach (var month in new[] { now.AddMonths(-1), now })
        {
            foreach (var cat in categories)
            {
                var count = rnd.Next(3, 7);
                for (int i = 0; i < count; i++)
                {
                    var descs = descriptions[cat];
                    transactions.Add(new Transaction
                    {
                        Id = id++,
                        UserId = 1,
                        Amount = rnd.Next(500, 8000),
                        Category = cat,
                        Description = descs[rnd.Next(descs.Length)],
                        Date = new DateTime(month.Year, month.Month,
                            rnd.Next(1, 28), 0, 0, 0, DateTimeKind.Utc),
                        IsRecurring = cat == Category.Utilities || cat == Category.Entertainment
                    });
                }
            }
        }

        modelBuilder.Entity<Transaction>().HasData(transactions);
    }

    private static string HashPassword(string password)
    {
        using var sha = System.Security.Cryptography.SHA256.Create();
        var bytes = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}
