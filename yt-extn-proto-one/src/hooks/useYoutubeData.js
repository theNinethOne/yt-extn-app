import { useState, useCallback } from "react";
import debounce from "lodash.debounce";

export function useYoutubeMetadata() {
  const [data, setData] = useState(null);

  const getMetadata = useCallback(
    debounce(async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["script.js"],
        });
  
        await new Promise((res) => setTimeout(res, 300));
  
        try {
          const response = await new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tab.id, { type: "GET_DATA" }, (response) => {
              if (chrome.runtime.lastError) {
                return reject(new Error(chrome.runtime.lastError.message));
              }
              resolve(response);
            });
          });
  
          if (response?.type === "YOUTUBE_METADATA") {
            setData(response.data);
          }
        } catch (err) {
          console.error("Error getting metadata:", err);
        }
    }, 500),
    []
  );

  return { data, getMetadata };
}
