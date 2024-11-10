using System;
using MessagePack;

[MessagePackObject]
public class TradeData
{
    [Key(0)] public Guid TradeId { get; set; }
    [Key(1)] public string Symbol { get; set; } = string.Empty;
    [Key(2)] public decimal Price { get; set; }
    [Key(3)] public int Volume { get; set; }
    [Key(4)] public DateTime Timestamp { get; set; }

    public static TradeData GenerateRandomTrade()
    {
        var symbols = new[] { "^VIX", "SPY", "IWM", "TLT", "SLV" };
        return new TradeData
        {
            TradeId = Guid.NewGuid(),
            Symbol = symbols[new Random().Next(symbols.Length)],
            Price = Math.Round((decimal)new Random().NextDouble() * 100, 2),
            Volume = new Random().Next(1, 5000),
            Timestamp = DateTime.Now
        };
    }
}