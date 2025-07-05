import { useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState();

  async function runContentScript(tabId) {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["script.js"],
    });
  }

  async function sendMessageToTab(type, color = null) {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Inject content script (only if needed)
    await runContentScript(tab.id);

    chrome.tabs.sendMessage(tab.id, { type, color }, (response) => {
      console.log("Response from script:", response);
      if (response) {
      } else {
        console.log("No response from script");
      }
    });

    chrome.runtime.onMessage.addListener(function handleResponse(
      message,
      sender,
      sendResponse
    ) {
      if (message.type === "YOUTUBE_METADATA") {
        setData(message.data);
        chrome.runtime.onMessage.removeListener(handleResponse); // Remove after use
      }
    });
  }

  return (
    <>
      <button onClick={() => sendMessageToTab("changeColor", "blue")}>
        Blue background
      </button>
      <button onClick={() => sendMessageToTab("changeColor", "red")}>
        Red background
      </button>
      <button onClick={() => sendMessageToTab("changeColorToGreen", "green")}>
        Green background
      </button>
      <button onClick={() => sendMessageToTab("getYouTubeData")}>
        Get YouTube Metadata
      </button>
      {data && data.title && (
        <div>
          <h3>{data.title}</h3>
          <p>
            <strong>Channel:</strong> {data.channel}
          </p>
          <p>
            <strong>Video ID:</strong> {data.videoId}
          </p>
          <p>
            <strong>Current Time:</strong> {Math.floor(data.currentTime)} sec
          </p>
          <p>
            <strong>Duration:</strong> {Math.floor(data.duration)} sec
          </p>
          <img
            src={data.thumbnailUrl}
            alt="thumbnail"
            style={{ width: "100%", borderRadius: "6px" }}
          />
        </div>
      )}
    </>
  );
}

export default App;
