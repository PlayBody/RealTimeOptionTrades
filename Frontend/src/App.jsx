import React, { useEffect, useState } from "react";
import msgpack from "@ygoe/msgpack";
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
        trade = msgpack.deserialize(new Uint8Array(event.data));
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
            <th>TIME</th>
            <th>SYMBOL</th>
            <th>OPTION</th>
            <th>QTY</th>
            <th>PRICE</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index}>
              <td>
                {trade[4]
                  ? new Date(trade[4]).toLocaleTimeString()
                  : "N/A"}
              </td>
              <td>{trade[1] !== undefined ? trade[1] : "N/A"}</td>
              <td>{`${trade[1]} - ${trade[4].toISOString().replace(/T/g, " ").replace(/Z/g, " ")}` ?? "N/A"}</td>
              <td>{trade[3] !== undefined ? trade[3] : "N/A"}</td>
              <td>
                {trade[2] !== null && trade[2] !== undefined
                  ? trade[2]
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
