public class TradeDataGeneratorService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var trade = TradeData.GenerateRandomTrade();
            TradeWebSocketHandler.BroadcastTrade(trade);
            await Task.Delay(500); // Simulate 2 trades per second
        }
    }
}