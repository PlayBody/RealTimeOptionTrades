import React, { useEffect, useState } from "react";
import msgpack from "@ygoe/msgpack";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState(false);
  const [ws, setWs] = useState(null);

  const connectWebSocket = () => {
    const websocket = new WebSocket("ws://localhost:5000/ws");
    websocket.binaryType = "arraybuffer";

    websocket.onopen = () => {
      console.log("WebSocket connected.");
      setError(false);
    };

    websocket.onmessage = (event) => {
      console.log("Received data:", event.data);
      let trade;
      try {
        trade = msgpack.deserialize(new Uint8Array(event.data));
      } catch (e) {
        console.error("Failed to decode message:", e);
        return;
      }
      setTrades((prevTrades) => {
        if (prevTrades && prevTrades.length && prevTrades.length >= 100) {
          prevTrades.pop();
        }
        return [trade, ...prevTrades];
      });
    };

    websocket.onerror = () => {
      console.error("WebSocket error.");
      setError(true);
    };

    websocket.onclose = () => {
      console.warn("WebSocket closed.");
      setError(true);
    };

    setWs(websocket);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
    // eslint-disable-next-line
  }, []);

  const handleReconnect = () => {
    setTrades([]); // Optionally clear trades on reconnect
    connectWebSocket();
  };

  return (
    <div className="container mt-5">
      <h3>Real-Time Option Trades Dashboard</h3>
      {error ? (
        <div className="alert alert-danger">
          WebSocket connection lost.
          <button className="btn btn-primary ml-2" onClick={handleReconnect}>
            Refresh
          </button>
        </div>
      ) : (
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
                  {trade[4] ? new Date(trade[4]).toLocaleTimeString() : "N/A"}
                </td>
                <td>{trade[1] !== undefined ? trade[1] : "N/A"}</td>
                <td>
                  {`${trade[1]} - ${
                    trade[4] ??
                    new Date(trade[4])
                      .toISOString()
                      .replace(/T/g, " ")
                      .replace(/Z/g, " ")
                  }` ?? "N/A"}
                </td>
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
      )}
    </div>
  );
}

export default App;
