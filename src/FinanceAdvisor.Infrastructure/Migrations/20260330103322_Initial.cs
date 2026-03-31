using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FinanceAdvisor.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsRecurring = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "mustafeez@demo.com", "Mustafeez Khan", "hashpassword" }
                });

            migrationBuilder.InsertData(
                table: "Transactions",
                columns: new[] { "Id", "Amount", "Category", "Date", "Description", "IsRecurring", "UserId" },
                values: new object[,]
                {
                    { 1, 1556m, 0, new DateTime(2026, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Swiggy Order", false, 1 },
                    { 2, 1763m, 0, new DateTime(2026, 2, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Zomato Dinner", false, 1 },
                    { 3, 4346m, 0, new DateTime(2026, 2, 21, 0, 0, 0, 0, DateTimeKind.Utc), "Swiggy Order", false, 1 },
                    { 4, 2259m, 0, new DateTime(2026, 2, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Zomato Dinner", false, 1 },
                    { 5, 2901m, 0, new DateTime(2026, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "Zomato Dinner", false, 1 },
                    { 6, 764m, 1, new DateTime(2026, 2, 16, 0, 0, 0, 0, DateTimeKind.Utc), "Metro Pass", false, 1 },
                    { 7, 3481m, 1, new DateTime(2026, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Uber Ride", false, 1 },
                    { 8, 5788m, 1, new DateTime(2026, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Metro Pass", false, 1 },
                    { 9, 831m, 1, new DateTime(2026, 2, 4, 0, 0, 0, 0, DateTimeKind.Utc), "Fuel", false, 1 },
                    { 10, 7296m, 1, new DateTime(2026, 2, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Fuel", false, 1 },
                    { 11, 811m, 2, new DateTime(2026, 2, 16, 0, 0, 0, 0, DateTimeKind.Utc), "Movie Tickets", true, 1 },
                    { 12, 6657m, 2, new DateTime(2026, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Netflix", true, 1 },
                    { 13, 6538m, 2, new DateTime(2026, 2, 11, 0, 0, 0, 0, DateTimeKind.Utc), "Concert", true, 1 },
                    { 14, 697m, 3, new DateTime(2026, 2, 22, 0, 0, 0, 0, DateTimeKind.Utc), "Electricity Bill", true, 1 },
                    { 15, 5198m, 3, new DateTime(2026, 2, 7, 0, 0, 0, 0, DateTimeKind.Utc), "Electricity Bill", true, 1 },
                    { 16, 6293m, 3, new DateTime(2026, 2, 18, 0, 0, 0, 0, DateTimeKind.Utc), "Internet Bill", true, 1 },
                    { 17, 833m, 5, new DateTime(2026, 2, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Clothing", false, 1 },
                    { 18, 880m, 5, new DateTime(2026, 2, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Flipkart Order", false, 1 },
                    { 19, 5213m, 5, new DateTime(2026, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Amazon Purchase", false, 1 },
                    { 20, 2505m, 0, new DateTime(2026, 3, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Swiggy Order", false, 1 },
                    { 21, 1032m, 0, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Zomato Dinner", false, 1 },
                    { 22, 6483m, 0, new DateTime(2026, 3, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Zomato Dinner", false, 1 },
                    { 23, 4246m, 0, new DateTime(2026, 3, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Swiggy Order", false, 1 },
                    { 24, 523m, 1, new DateTime(2026, 3, 18, 0, 0, 0, 0, DateTimeKind.Utc), "Uber Ride", false, 1 },
                    { 25, 759m, 1, new DateTime(2026, 3, 26, 0, 0, 0, 0, DateTimeKind.Utc), "Metro Pass", false, 1 },
                    { 26, 3958m, 1, new DateTime(2026, 3, 17, 0, 0, 0, 0, DateTimeKind.Utc), "Ola Cab", false, 1 },
                    { 27, 3295m, 2, new DateTime(2026, 3, 12, 0, 0, 0, 0, DateTimeKind.Utc), "Netflix", true, 1 },
                    { 28, 6442m, 2, new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc), "Concert", true, 1 },
                    { 29, 2730m, 2, new DateTime(2026, 3, 16, 0, 0, 0, 0, DateTimeKind.Utc), "Spotify", true, 1 },
                    { 30, 645m, 3, new DateTime(2026, 3, 26, 0, 0, 0, 0, DateTimeKind.Utc), "Water Bill", true, 1 },
                    { 31, 2996m, 3, new DateTime(2026, 3, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Mobile Recharge", true, 1 },
                    { 32, 1273m, 3, new DateTime(2026, 3, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Internet Bill", true, 1 },
                    { 33, 6320m, 3, new DateTime(2026, 3, 4, 0, 0, 0, 0, DateTimeKind.Utc), "Electricity Bill", true, 1 },
                    { 34, 2117m, 3, new DateTime(2026, 3, 14, 0, 0, 0, 0, DateTimeKind.Utc), "Mobile Recharge", true, 1 },
                    { 35, 6246m, 5, new DateTime(2026, 3, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Clothing", false, 1 },
                    { 36, 2671m, 5, new DateTime(2026, 3, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Clothing", false, 1 },
                    { 37, 5381m, 5, new DateTime(2026, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Amazon Purchase", false, 1 },
                    { 38, 7467m, 5, new DateTime(2026, 3, 6, 0, 0, 0, 0, DateTimeKind.Utc), "Amazon Purchase", false, 1 },
                    { 39, 2490m, 5, new DateTime(2026, 3, 6, 0, 0, 0, 0, DateTimeKind.Utc), "Amazon Purchase", false, 1 },
                    { 40, 4942m, 5, new DateTime(2026, 3, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Flipkart Order", false, 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_UserId",
                table: "Transactions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
