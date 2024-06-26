﻿using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Interfaces;
using API.Services;
using API.Helpers;
using API.SignalR;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
    {
        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();
        // scoped to each request and disposed after the request
        // Implementing the interface will automatically inject the service - see AccountController
        // services.AddScoped<IUserRepository, UserRepository>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings")); // comes from appsettings.json
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<LogUserActivity>();
        services.AddSignalR();
        services.AddSingleton<PresenceTracker>(); // not to be destroyed with http request
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        return services;
    }
}
