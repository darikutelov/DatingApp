using API.Data;
using API.Entities;
using API.Extensions;
using API.MiddleWare;
using API.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Custom Extentions from E
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(builder => builder.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials() // to enable SignalR to 
    .WithOrigins("https://localhost:4200")
    );

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add for JWT
app.UseAuthentication(); // do you have a valid token
app.UseAuthorization(); // you have a token -> what can you do

app.MapControllers();

// Add SignalR 
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

using var scope = app.Services.CreateScope();
var service = scope.ServiceProvider;
try
{
    var context = service.GetRequiredService<DataContext>();
    var userManager = service.GetRequiredService<UserManager<AppUser>>();
    var roleManager = service.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    //context.Connections.RemoveRange(context.Connections);
    //await context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE [Connections]");
    await context.Database.ExecuteSqlRawAsync("DELETE FROM [Connections]");
    await Seed.SeedUsers(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = service.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();
