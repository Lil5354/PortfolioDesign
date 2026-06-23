using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace UEFGallery.API.Services;

public class ImageEmbeddingService
{
    private readonly string _modelPath = "mobilenetv2-7.onnx";
    private readonly string _cachePath = "embeddings_cache.json";
    private InferenceSession? _session;
    private ConcurrentDictionary<string, float[]> _embeddingsCache = new();
    private readonly ILogger<ImageEmbeddingService> _logger;
    public bool IsReady { get; private set; } = false;

    public ImageEmbeddingService(ILogger<ImageEmbeddingService> logger)
    {
        _logger = logger;
        _ = InitializeAsync();
    }

    private async Task InitializeAsync()
    {
        try
        {
            if (!File.Exists(_modelPath))
            {
                _logger.LogInformation("Downloading MobileNetV2 ONNX model (approx 13MB)...");
                using var client = new HttpClient();
                // We use a reliable ONNX model CDN
                var response = await client.GetAsync("https://github.com/onnx/models/raw/main/validated/vision/classification/mobilenet/model/mobilenetv2-7.onnx");
                response.EnsureSuccessStatusCode();
                await using var fs = new FileStream(_modelPath, FileMode.Create);
                await response.Content.CopyToAsync(fs);
            }

            _session = new InferenceSession(_modelPath);

            if (File.Exists(_cachePath))
            {
                var json = await File.ReadAllTextAsync(_cachePath);
                var loaded = JsonSerializer.Deserialize<Dictionary<string, float[]>>(json);
                if (loaded != null)
                {
                    _embeddingsCache = new ConcurrentDictionary<string, float[]>(loaded);
                }
            }

            IsReady = true;
            _logger.LogInformation("ImageEmbeddingService is ready. Loaded {Count} embeddings from cache.", _embeddingsCache.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize ImageEmbeddingService.");
        }
    }

    public async Task<float[]?> GetEmbeddingAsync(Stream imageStream)
    {
        if (!IsReady || _session == null) return null;

        try
        {
            using var image = await Image.LoadAsync<Rgb24>(imageStream);
            
            // Resize to 224x224
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(224, 224),
                Mode = ResizeMode.Crop
            }));

            // Preprocess (ImageNet normalization)
            var tensor = new DenseTensor<float>(new[] { 1, 3, 224, 224 });
            var mean = new[] { 0.485f, 0.456f, 0.406f };
            var stddev = new[] { 0.229f, 0.224f, 0.225f };

            image.ProcessPixelRows(accessor =>
            {
                for (int y = 0; y < accessor.Height; y++)
                {
                    Span<Rgb24> pixelRow = accessor.GetRowSpan(y);
                    for (int x = 0; x < accessor.Width; x++)
                    {
                        tensor[0, 0, y, x] = ((pixelRow[x].R / 255f) - mean[0]) / stddev[0];
                        tensor[0, 1, y, x] = ((pixelRow[x].G / 255f) - mean[1]) / stddev[1];
                        tensor[0, 2, y, x] = ((pixelRow[x].B / 255f) - mean[2]) / stddev[2];
                    }
                }
            });

            var inputs = new List<NamedOnnxValue>
            {
                NamedOnnxValue.CreateFromTensor("data", tensor)
            };

            using var results = _session.Run(inputs);
            var output = results.First().AsTensor<float>().ToArray();
            
            // Normalize the output vector
            float length = (float)Math.Sqrt(output.Sum(x => x * x));
            if (length > 0)
            {
                for (int i = 0; i < output.Length; i++) output[i] /= length;
            }

            return output;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating embedding.");
            return null;
        }
    }

    public void SaveEmbeddingToCache(string artworkId, float[] embedding)
    {
        _embeddingsCache[artworkId] = embedding;
        File.WriteAllText(_cachePath, JsonSerializer.Serialize(_embeddingsCache));
    }

    public List<(string ArtworkId, float Score)> SearchSimilar(float[] queryVector, int topK = 10)
    {
        var results = new List<(string ArtworkId, float Score)>();
        foreach (var kvp in _embeddingsCache)
        {
            float score = CosineSimilarity(queryVector, kvp.Value);
            results.Add((kvp.Key, score));
        }

        return results.OrderByDescending(x => x.Score).Take(topK).ToList();
    }

    private float CosineSimilarity(float[] v1, float[] v2)
    {
        if (v1.Length != v2.Length) return 0;
        float dotProduct = 0;
        for (int i = 0; i < v1.Length; i++)
        {
            dotProduct += v1[i] * v2[i];
        }
        return dotProduct;
    }
}
