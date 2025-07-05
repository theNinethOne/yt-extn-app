function bgChange(request) {
    if (request.type === "changeColor") {
      document.body.style.backgroundColor = request.color;
      return { status: "changed to " + request.color };
    }
  
    if (request.type === "changeColorToGreen") {
      document.body.style.backgroundColor = request.color;
      return { status: "changed to green" };
    }
  
    return null;
  }
  
  function youTubeData() {
    const video = document.querySelector('video');
    const title = document.title.replace(' - YouTube', '');
    const url = window.location.href;
    const videoId = new URL(url).searchParams.get("v");
  
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  
    const metadata = {
      title,
      videoId,
      currentTime: video?.currentTime ?? 0,
      duration: video?.duration ?? 0,
      channel: document.querySelector('#channel-name a')?.innerText?.trim(),
      thumbnailUrl,
      url,
    };
  
    chrome.runtime.sendMessage({ type: "YOUTUBE_METADATA", data: metadata });
  }
  
  // Always register the message listener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const currentUrl = window.location.href;
  
    // Send video metadata if YouTube
    if (currentUrl.includes("youtube.com") && request.type === "getYouTubeData") {
      youTubeData();
      sendResponse({ status: "metadata sent" });
      return;
    }
  
    // Background color change
    const result = bgChange(request);
    if (result) {
      sendResponse(result);
    }
  });
  