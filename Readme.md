# Real-Time Option Trades Dashboard

## Prerequisites
- .NET Core SDK (3.1 or later)
- Node.js (Optional, for running JavaScript-related tools)

## Running the Server
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run the following commands:
   ```
   dotnet restore
   dotnet run
   ```
4. The server will start on `http://localhost:5000/`.

## Running the Client
1. Open `index.html` in your browser.
2. Make sure that the WebSocket endpoint in `index.html` points to `ws://localhost:5000/ws`.

## Notes
- This is a demonstration project.
- Make sure that the server is running before opening the client HTML file.
```

### **Explanation**
- **Server**: ASP.NET Core WebSocket server that generates option trades and broadcasts them using MessagePack for efficient binary serialization.
- **Client**: A simple HTML page with JavaScript to connect to the WebSocket server, deserialize the data, and display it in a Bootstrap table.

### **Testing Instructions**
- Unit tests should be created for the data generation and serialization functionalities. For example, you can use xUnit or NUnit.
- WebSocket connection handling should be tested for error scenarios such as server downtime or disconnection.
