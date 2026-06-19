using System.Threading.Channels;

namespace UEFGallery.API.Services.Background;

public class FanoutEvent
{
    public string ArtworkId { get; set; } = string.Empty;
    public string ActorId { get; set; } = string.Empty;
    public string ActorName { get; set; } = string.Empty;
    public string ArtworkTitle { get; set; } = string.Empty;
}

public class FanoutEventChannel
{
    private readonly Channel<FanoutEvent> _channel;

    public FanoutEventChannel()
    {
        var options = new BoundedChannelOptions(1000)
        {
            FullMode = BoundedChannelFullMode.Wait
        };
        _channel = Channel.CreateBounded<FanoutEvent>(options);
    }

    public async Task AddEventAsync(FanoutEvent fanoutEvent, CancellationToken cancellationToken = default)
    {
        await _channel.Writer.WriteAsync(fanoutEvent, cancellationToken);
    }

    public IAsyncEnumerable<FanoutEvent> ReadAllAsync(CancellationToken cancellationToken = default)
    {
        return _channel.Reader.ReadAllAsync(cancellationToken);
    }
}
