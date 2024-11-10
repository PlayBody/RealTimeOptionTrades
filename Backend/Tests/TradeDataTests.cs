using Xunit;

public class TradeDataTests
{
    [Fact]
    public void GenerateRandomTrade_ShouldGenerateValidTrade()
    {
        // Act
        var trade = TradeData.GenerateRandomTrade();

        // Assert
        Assert.NotNull(trade);
        Assert.NotEqual(Guid.Empty, trade.TradeId);
        Assert.False(string.IsNullOrEmpty(trade.Symbol));
        Assert.InRange(trade.Price, 0, 100);
        Assert.InRange(trade.Volume, 1, 10000);
        Assert.True(trade.Timestamp <= DateTime.Now);
    }
}