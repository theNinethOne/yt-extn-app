import { useEffect, useRef, useState } from "react";

export function useGetCurrentTime( intervalMs = 5000 ) {
  const [currentVIdeoTime, setCurrentVIdeoTime] = useState();
  const intervalRef = useRef(null)

  useEffect(() => {

    const currentTime = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["script.js"],
    });


    intervalRef.current = setInterval(async () => {
      try {
        const res = await new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(
            tab.id,
            { type: "GET_CURRENT_TIME" },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(response);
              }
            }
          );
        });

        if (res?.type === "CURRENT_TIME") {
          setCurrentVIdeoTime(res.data);
          return res.data;
        }
      } catch (error) {
        console.log(error);
      }
    }, intervalMs) }

    currentTime()

    return () => {
        clearInterval(intervalRef.current)
    }
  }, [ intervalMs ] )

  return { currentVIdeoTime };
}
