var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("Fusion");

builder.Services
    .AddFusionGatewayServer()
    .ConfigureFromFile("./fusion.graphql")
    .CoreBuilder
    .ModifyRequestOptions(o => o.IncludeExceptionDetails = true);

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
