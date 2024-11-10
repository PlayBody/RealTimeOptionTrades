# Programming Exercise: Real-Time Option Trades Dashboard
## Objective:
Develop a real-time dashboard that receives streaming data from a server via a WebSocket API and
displays it on a webpage. The data represents a flow of option trades, which should be generated on
the server.
## Requirements:
1. Server-Side Implementation:
> Language & Framework: 

Use C# with ASP.NET Core.

> WebSocket API: 

Implement a WebSocket server that streams option trade data
using binary serialization.
> Data Generation: 

Simulate option trade data on the server side. Each trade should include:
* Trade ID
* Option Symbol
* Trade Price
* Trade Volume
* Timestamp
> Binary Serialization: 

Serialize the trade data into a binary format before sending it through the WebSocket (ex. MessagePack or ProtoBuf).

2. Client-Side Implementation:
> Webpage: 

Create a responsive webpage to display the streaming data (see Fig.1).
> WebSocket Client: Implement a WebSocket client to connect to the server and
receive the trade data.
> Data Deserialization: 

Deserialize the binary data received from the WebSocket into a readable format.
> Data Display: 

Display the received trade data in a tabular format. The table should update in real-time as new data is received and be sorted by timestamp in
descending order. No need to implement additional sorting, filtering , and coloring
features.
> Frameworks & Libraries: 

You may use any front-end framework (e.g., React, Vue, or
plain JavaScript) and any CSS framework (e.g., Bootstrap) to build the webpage.
3. Additional Requirements:
> Code Quality: Ensure the code is clean, well-commented, and follows best
practices.
> Error Handling: 

Implement error handling for WebSocket connection issues and data
parsing errors.
> Architecture: 

Proper separation of concerns and use of design patterns.
> Performance: 

Effecient handling of streaming data and smooth updates on the client side.
> Testing: 

Provide passing unit tests for your solution.
Submission:

> Do not submit your solution to a public code repositories or public file storage sites (like GitHub, Google Drive etc.).

Instead compress your code as a ZIP file and upload to ....

> Include a README file with instructions on how to set up and run the application.

