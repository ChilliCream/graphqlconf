var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddDbContextPool<ReviewContext>(
        o => o.UseSqlite("Data Source=review.db"));

builder.Services
    .AddGraphQLServer()
    .AddTypes()
    .AddGlobalObjectIdentification()
    .AddMutationConventions()
    .AddInMemorySubscriptions()
    .RegisterDbContext<ReviewContext>()
    .AddInstrumentation(o => o.RenameRootActivity = true)
    .AddIdSerializer<CustomIdSerialzer>();

var app = builder.Build();

await DatabaseHelper.SeedDatabaseAsync(app);

app.UseWebSockets();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);