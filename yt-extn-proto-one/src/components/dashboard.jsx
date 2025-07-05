import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../pb";

export default function Dashboard() {
  const navigate = useNavigate();
  const [renderData, setRenderData] = useState();

  async function injectScript(tabId) {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["script.js"],
    });
  }

  async function getYTData(type) {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await injectScript(tab.id);


    try {
        const response = await new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(tab.id, { type }, (response) => {
            if (chrome.runtime.lastError) {
              return reject(chrome.runtime.lastError);
            }
            resolve(response);
          });
        });
  
        if (response && response.type === "YOUTUBE_METADATA") {
          setRenderData(response.data);
          console.log("Received YouTube Data:", response.data);
        } else {
          console.log("No valid YOUTUBE_METADATA response from script.js.");
        }
      } catch (error) {
        console.error("Error sending message or receiving response:", error);
      }

    // chrome.tabs.sendMessage(tab.id, { type }, (response) => {
    //   response
    //     ? console.log(response)
    //     : console.log(" No response from script.js ");
    // });

    // chrome.runtime.onMessage.addListener(function recieveYTData(
    //   msg,
    //   sender,
    //   res
    // ) {
    //   if (msg.type === "YOUTUBE_METADATA") {
    //     setRenderData(msg.data);
    //     chrome.runtime.onMessage.removeListener(recieveYTData);
    //   }
    // });
  }

  return (
    <>
     
      <button className="bg-red-500" onClick={() => navigate("/tabsDash")}>
        TABS
      </button>
      Dashboard page
      <button onClick={() => getYTData("GET_DATA")}>Get YT Data</button>
      <div>
        {renderData && renderData.videoTitle && (
          <div>
            <h3>{renderData.videoTitle}</h3>
            <p>
              <strong>Channel:</strong> {renderData.channelName}
            </p>
            <p>
              <strong>Video ID:</strong> {renderData.videoId}
            </p>
            <p>
              <strong>Current Time:</strong>{" "}
              {Math.floor(renderData.currentVideoTime)} sec
            </p>
            <p>
              <strong>Duration:</strong> {Math.floor(renderData.videoDuration)}{" "}
              sec
            </p>
            <img
              src={renderData.thumbnailUrl}
              alt="thumbnail"
              style={{ width: "100%", borderRadius: "6px" }}
            />
          </div>
        )}
      </div>
    </>
  );
}
