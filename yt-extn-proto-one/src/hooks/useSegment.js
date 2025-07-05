import { useState } from "react";

export function useSegment() {
  const [time, setTime] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const segmentHandler = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const type = "segment";

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["script.js"],
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    try {
      const response = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tab.id, { type }, (res) => {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
            return;
          }
          resolve(res);
        });
      });


      if (response && response?.type === "segment_data") {
        setTime(response.data);
        console.log("time data recieved", response.data);
        return response.data;
      } else {
        setError("Failed to get time");
      }
    } catch (err) {
      console.error("Error fetching current time:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { segmentHandler, time, loading, error };
}
