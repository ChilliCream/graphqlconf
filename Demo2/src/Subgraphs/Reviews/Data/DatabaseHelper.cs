using Microsoft.AspNetCore.Mvc.Diagnostics;

namespace Demo.Reviews.Data;

public static class DatabaseHelper
{
    public static async Task SeedDatabaseAsync(WebApplication app)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var context = scope.ServiceProvider.GetRequiredService<ReviewContext>();
        if (await context.Database.EnsureCreatedAsync())
        {
            var ada = new User
            {
                Name = "pascal"
            };

            var alan = new User
            {
                Name = "sophie95"
            };

            var alan1 = new User
            {
                Name = "ethan88"
            };

            var alan2 = new User
            {
                Name = "graceful02"
            };

            var alan3 = new User
            {
                Name = "aiden92"
            };

            var alan4 = new User
            {
                Name = "dylan_rock"
            };

            var alan5 = new User
            {
                Name = "olive04"
            };

            await context.Users.AddRangeAsync(
                ada, 
                alan,
                alan1,
                alan2,
                alan3,
                alan4,
                alan5);

            await context.Reviews.AddRangeAsync(
                new Review
                {
                    Body = "Love it!",
                    Stars = 5,
                    ProductId = 1,
                    Author = ada
                },
                new Review
                {
                    Body = "Too expensive.",
                    Stars = 1,
                    ProductId = 2,
                    Author = alan
                },
                new Review
                {
                    Body = "Could be better.",
                    Stars = 3,
                    ProductId = 3,
                    Author = ada,
                },
                new Review
                {
                    Body = "Prefer something else.",
                    Stars = 3,
                    ProductId = 2,
                    Author = alan
                });
            await context.SaveChangesAsync();
        }
    }

}