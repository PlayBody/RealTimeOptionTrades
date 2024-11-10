import React from "react";
import {
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import App from "./App";
import msgpack from "@ygoe/msgpack";
import { WS } from "jest-websocket-mock"; // Import jest-websocket-mock
import "@testing-library/jest-dom";

describe("App Component", () => {
  let server;

  beforeEach(() => {
    // Set up a mock WebSocket server
    server = new WS("ws://localhost:5000/ws");
  });

  afterEach(() => {
    // Clean up WebSocket server after each test
    WS.clean();
  });

  test("renders the dashboard title", () => {
    render(<App />);
    expect(
      screen.getByText(/Real-Time Option Trades Dashboard/i)
    ).toBeInTheDocument();
  });

  test("shows error message on WebSocket error", async () => {
    render(<App />);

    // Simulate WebSocket error
    act(() => {
      server.error();
    });

    // Assert that the error message appears
    await waitFor(() => {
      expect(
        screen.getByText(/WebSocket connection lost/i)
      ).toBeInTheDocument();
    });
  });

  test("handles incoming trade messages", async () => {
    const tradeData = msgpack.serialize([
      123,
      "AAPL",
      150.0,
      10,
      new Date().toISOString(),
    ]);

    render(<App />);

    // Simulate WebSocket connection and incoming message
    await server.connected;
    server.send(tradeData.buffer);

    // Wait for the trade message to be displayed
    await waitFor(() => {
      expect(screen.getByText("AAPL")).toBeInTheDocument();
      expect(screen.getByText("150")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });
});
