using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UEFGallery.API.Data;
using UEFGallery.API.Services.Background;
using UEFGallery.API.Services;

using System.IO;
using UEFGallery.API.Hubs;

// Load .env from parent directory
var envPath = Path.Combine(Directory.GetCurrentDirectory(), "..", ".env");
if (File.Exists(envPath))
{
    foreach (var line in File.ReadAllLines(envPath))
    {
        if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#")) continue;
        var parts = line.Split('=', 2);
        if (parts.Length == 2)
        {
            var key = parts[0].Trim();
            var value = parts[1].Trim().Trim('"');
            Environment.SetEnvironmentVariable(key, value);
        }
    }
}

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// Register GeminiService
builder.Services.AddHttpClient<UEFGallery.API.Services.GeminiService>();

// Configure DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "Host=localhost;Database=uefgallery;Username=postgres;Password=postgres";

builder.Services.AddDbContext<GalleryDbContext>(options =>
    options.UseSqlite(connectionString).UseSnakeCaseNamingConvention());

// Configure JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "your_super_secret_key_that_is_long_enough";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
    .AddCookie()
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    })
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? "dummy-client-id";
        options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? "dummy-client-secret";
    });

// Configure CORS for Vite React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVite",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Add your frontend origins
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Register Fanout Background Service
builder.Services.AddSingleton<ImageEmbeddingService>();
builder.Services.AddSingleton<FanoutEventChannel>();
builder.Services.AddHostedService<FanoutBackgroundService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true) // Force developer exceptions for debugging
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(c => c.Run(async context =>
{
    var exception = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
    context.Response.StatusCode = 500;
    context.Response.ContentType = "application/json";
    await context.Response.WriteAsJsonAsync(new { error = exception?.Message, stack = exception?.StackTrace });
}));


app.UseHttpsRedirection();

app.UseCors("AllowVite");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.Run();
