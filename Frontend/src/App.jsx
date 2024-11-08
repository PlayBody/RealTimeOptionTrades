import React, { useEffect, useState } from "react";
import { decode } from "messagepack";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/ws");
    ws.binaryType = "arraybuffer";

    ws.onmessage = (event) => {
      console.log("Received data:", event.data);
      let trade;
      try {
        trade = decode(new Uint8Array(event.data));
      } catch (e) {
        console.error("Failed to decode message:", e);
        return;
      }

      setTrades((prevTrades) => [trade, ...prevTrades]);
    };

    ws.onerror = () => {
      console.error("WebSocket error.");
    };

    ws.onclose = () => {
      console.warn("WebSocket closed.");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="container mt-5">
      <h3>Real-Time Option Trades Dashboard</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Time</th>
            <th>Symbol</th>
            <th>Option</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index}>
              <td>
                {trade.Timestamp
                  ? new Date(trade.Timestamp).toLocaleTimeString()
                  : "N/A"}
              </td>
              <td>{trade.Symbol !== undefined ? trade.Symbol : "N/A"}</td>
              <td>{trade.Option ?? "N/A"}</td>
              <td>{trade.Volume !== undefined ? trade.Volume : "N/A"}</td>
              <td>
                {trade.Price !== null && trade.Price !== undefined
                  ? trade.Price.toFixed(2)
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
