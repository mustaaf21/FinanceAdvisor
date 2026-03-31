using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace FinanceAdvisor.Infrastructure.External;

public class GroqClient
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private const string Model = "llama-3.1-8b-instant";
    private const string BaseUrl = "https://api.groq.com/openai/v1/chat/completions";

    public GroqClient(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey = config["GROQ_API_KEY"]
            ?? throw new InvalidOperationException("Groq:ApiKey not configured");
    }

    public async Task<string> CompleteAsync(string prompt)
    {
        var payload = new
        {
            model = Model,
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            max_tokens = 512,
            temperature = 0.3
        };

        var json = JsonSerializer.Serialize(payload);
        var request = new HttpRequestMessage(HttpMethod.Post, BaseUrl)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
        request.Headers.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

        var response = await _http.SendAsync(request);
        

        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine("GROQ ERROR:");
            Console.WriteLine(responseJson);
            throw new Exception(responseJson);
        }

        var doc = JsonDocument.Parse(responseJson);

        return doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "Unable to generate response";
    }
}
