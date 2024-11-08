using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using MessagePack;

public static class TradeWebSocketHandler
{
    private static readonly ConcurrentBag<WebSocket> WebSockets = new();

    public static async Task HandleWebSocketAsync(WebSocket webSocket)
    {
        
        WebSockets.Add(webSocket);

        var buffer = new byte[1024 * 4];
        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!result.CloseStatus.HasValue)
        {
            result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        }

        if (webSocket != null) WebSockets.TryTake(out webSocket);
        await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
    }

    public static async void BroadcastTrade(TradeData trade)
    {
        var data = MessagePackSerializer.Serialize(trade);
        foreach (var socket in WebSockets)
        {
            if (socket != null && socket.State == WebSocketState.Open)
            {
                await socket.SendAsync(new ArraySegment<byte>(data), WebSocketMessageType.Binary, true, CancellationToken.None);
            }
        }
    }
}