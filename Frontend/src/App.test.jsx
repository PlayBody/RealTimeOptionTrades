// App.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import msgpack from "@ygoe/msgpack";
import '@testing-library/jest-dom';

const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  onopen: jest.fn(),
  onmessage: jest.fn(),
  onerror: jest.fn(),
  onclose: jest.fn(),
  addEventListener: jest.fn((event, callback) => {
    if (event === "open") mockWebSocket.onopen = callback;
    if (event === "message") mockWebSocket.onmessage = callback;
    if (event === "error") mockWebSocket.onerror = callback;
    if (event === "close") mockWebSocket.onclose = callback;
  }),
  removeEventListener: jest.fn(),
};

global.WebSocket = jest.fn(() => mockWebSocket);

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the dashboard title", () => {
    render(<App />);
    expect(screen.getByText(/Real-Time Option Trades Dashboard/i)).toBeInTheDocument();
  });

  test("shows error message on WebSocket error", async () => {
    render(<App />);

    // Simulate WebSocket error
    mockWebSocket.onerror(); // Trigger the error

    await waitFor(() => {
      expect(screen.getByText(/WebSocket connection lost/i)).toBeInTheDocument();
    });
  });

  test("handles incoming trade messages", async () => {
    const tradeData = msgpack.serialize([123, "AAPL", 150.0, 10, new Date().toISOString()]);

    render(<App />);

    // Simulate WebSocket opening
    mockWebSocket.onopen();

    // Simulate receiving a message
    mockWebSocket.onmessage({ data: tradeData });

    await waitFor(() => {
      expect(screen.getByText("AAPL")).toBeInTheDocument();
      expect(screen.getByText("150")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  test("reconnects on button click", async () => {
    render(<App />);

    // Simulate WebSocket error
    mockWebSocket.onerror();

    await waitFor(() => {
      expect(screen.getByText(/WebSocket connection lost/i)).toBeInTheDocument();
    });

    // Simulate clicking the reconnect button
    const button = screen.getByText(/Refresh/i);
    fireEvent.click(button);

    // Simulate WebSocket reconnect
    mockWebSocket.onopen();

    await waitFor(() => {
      expect(screen.queryByText(/WebSocket connection lost/i)).not.toBeInTheDocument();
    });
  });
});
