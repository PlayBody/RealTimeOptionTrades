using System.Collections.Concurrent;
using System.Net.WebSockets;
using MessagePack;

public static class TradeWebSocketHandler
{
    public static ConcurrentBag<WebSocket> WebSockets = new();

    public static async Task HandleWebSocketAsync(WebSocket webSocket)
    {

        WebSockets.Add(webSocket);

        var buffer = new byte[1024 * 4];
        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        // Use a separate variable to check if the WebSocket was successfully removed
        if (webSocket != null)
        {
            if (WebSockets.TryTake(out _))
            {
                if (result.CloseStatus != null) await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
        }
    }

    public static async Task BroadcastTrade(TradeData trade)
    {
        Console.WriteLine($"Broadcasting trade: {trade.Symbol}, {trade.Price}, {trade.Volume}, {trade.Timestamp}");
        var data = MessagePackSerializer.Serialize(trade);
        foreach (var socket in WebSockets)
        {
            if (socket != null && socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(new ArraySegment<byte>(data), WebSocketMessageType.Binary, true, CancellationToken.None);
            }
        }
    }
    
    public static IEnumerable<WebSocket> GetWebSockets()
    {
        return WebSockets;
    }
}