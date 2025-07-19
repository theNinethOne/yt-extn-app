import { useEffect, useRef, useState } from "react";

export function useGetCurrentTime(intervalMs = 3000) {
  const [currentVideoTime, setCurrentVideoTime] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let tabId = null;

    const setup = async () => {

        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        tabId = tab.id;

        // Inject content script (if not already)
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ["script.js"],
        });

        // Start polling
        intervalRef.current = setInterval(async () => {
          try {
            const response = await new Promise((resolve, reject) => {
              chrome.tabs.sendMessage(
                tabId,
                { type: "GET_CURRENT_TIME" },
                (res) => {
                  if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                  } else {
                    resolve(res);
                  }
                }
              );
            });

            if (response?.type === "CURRENT_TIME") {
              setCurrentVideoTime(response.data);
            }
          } catch (error) {
            console.warn("Failed to fetch current time:", error.message);
          }
        }, intervalMs)  }

    setup();


    return () => {
      clearInterval(intervalRef.current);
    };
  }, [intervalMs]);

  return { currentVideoTime };
}
