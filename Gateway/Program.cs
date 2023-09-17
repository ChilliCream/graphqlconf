var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("Fusion");

builder.Services
    .AddFusionGatewayServer()
    .ConfigureFromFile("./gateway.fgp")
    .CoreBuilder
    .ModifyRequestOptions(o => o.IncludeExceptionDetails = true);

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
