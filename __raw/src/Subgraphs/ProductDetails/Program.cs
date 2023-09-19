var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddSingleton<ProductRepository>();

builder.Services
    .AddGraphQLServer()
    .AddTypes()
    .AddApolloFederation()
    .AddIdSerializer<CustomIdSerialzer>()
    .RegisterService<ProductRepository>()
    .RegisterService<IIdSerializer>()
    .ModifyRequestOptions(o => o.IncludeExceptionDetails = true);

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
