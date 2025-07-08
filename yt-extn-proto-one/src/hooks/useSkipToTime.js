export function useSkipToTime() {

    const skipToTime = async ( startTime ) => {

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true})

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["script.js"]
        })

        await new Promise((resolve) => setTimeout(resolve, 1000))

        try{
            await new Promise((resolve, reject) => {
                chrome.tabs.sendMessage( tab.id, { type: "SEEK_TO_TIME", time: startTime}, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError)
                    } else if (response?.success) {
                        console.log("Successfully skipped to:");
                      } else {
                        console.error("Failed:", response?.error);
                      }
                })
            })
        } catch (err) {
            console.error("failed to skip to time", err)
        }
    }

    return { skipToTime }
}