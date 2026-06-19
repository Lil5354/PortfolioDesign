using Microsoft.EntityFrameworkCore;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

namespace UEFGallery.API.Services.Background;

public class FanoutBackgroundService : BackgroundService
{
    private readonly FanoutEventChannel _channel;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<FanoutBackgroundService> _logger;

    public FanoutBackgroundService(
        FanoutEventChannel channel,
        IServiceProvider serviceProvider,
        ILogger<FanoutBackgroundService> logger)
    {
        _channel = channel;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("FanoutBackgroundService is starting.");

        await foreach (var fanoutEvent in _channel.ReadAllAsync(stoppingToken))
        {
            try
            {
                await ProcessFanoutEventAsync(fanoutEvent, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred processing fanout event for ArtworkId {ArtworkId}", fanoutEvent.ArtworkId);
            }
        }

        _logger.LogInformation("FanoutBackgroundService is stopping.");
    }

    private async Task ProcessFanoutEventAsync(FanoutEvent fanoutEvent, CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<GalleryDbContext>();

        // Lấy tất cả follower của Actor (người đăng bài)
        var followers = await context.Follows
            .Where(f => f.FollowedId == fanoutEvent.ActorId)
            .Select(f => f.FollowerId)
            .ToListAsync(stoppingToken);

        if (!followers.Any())
        {
            return;
        }

        // Tạo Notification cho mỗi follower (batching)
        const int batchSize = 500;
        for (int i = 0; i < followers.Count; i += batchSize)
        {
            var batch = followers.Skip(i).Take(batchSize).ToList();
            var notifications = batch.Select(followerId => new Notification
            {
                Id = Guid.NewGuid().ToString(),
                UserId = followerId,
                Type = NotificationType.new_post_from_following,
                ReferenceId = fanoutEvent.ArtworkId,
                ReferenceType = "artwork",
                Content = $"{fanoutEvent.ActorName} vừa đăng một tác phẩm mới: \"{fanoutEvent.ArtworkTitle}\"",
                ActorId = fanoutEvent.ActorId,
                ActorName = fanoutEvent.ActorName,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            });

            context.Notifications.AddRange(notifications);
            await context.SaveChangesAsync(stoppingToken);
            
            _logger.LogInformation("Processed batch of {Count} notifications for fanout event {ArtworkId}", batch.Count, fanoutEvent.ArtworkId);
        }
    }
}
