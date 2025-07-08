function getYoutubeData(){
    const video = document.querySelector("video");
    const videoUrl = window.location.href;
    const videoId = videoUrl.split("v=")[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const videoTitle = document.title.replace(' - YouTube','')
    const videoDescription = document.querySelector("meta[name='description']").content;
    const videoThumbnail = document.querySelector("meta[property='og:image']").content;
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    const videoDuration = video?.duration ?? 0
    const currentVideoTime = video?.currentTime ?? 0
    const channelName = document.querySelector('#channel-name a')?.innerText?.trim()
    const channelUrl = document.querySelector("meta[property='og:url']").content;

    const metaData = {
        videoTitle,
        videoDescription,
        videoThumbnail,
        thumbnailUrl,
        videoDuration,
        currentVideoTime,
        channelName,
        channelUrl,
        embedUrl,
        videoUrl,
        videoId
    }

    return metaData

    // chrome.runtime.sendMessage( { type : "YOUTUBE_METADATA", data : metaData } )

}

function getSegmentData(){
    const video = document.querySelector("video");
    const videoUrl = window.location.href;
    const videoId = videoUrl.split("v=")[1];
    const videoDuration = video?.duration ?? 0
    const currentVideoTime = video?.currentTime ?? 0

    const segmentData = {
        videoDuration,
        currentVideoTime,
        videoId
    }

    return segmentData

}


chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {

    const currentTabUrl = window.location.href

    if ( currentTabUrl.includes("youtube.com") && request.type === "GET_DATA" ) {
        const data = getYoutubeData()    
        sendResponse({ type : "YOUTUBE_METADATA", data : data });
        return true
    }

    if ( currentTabUrl.includes("youtube.com") && request.type === "segment" ) {
        const data = getSegmentData()    
        sendResponse({ type : "segment_data", data : data });
        return true
    }

    if ( currentTabUrl.includes("youtube.com") && request.type === "SEEK_TO_TIME") {
        const player = document.querySelector("video");
        if (player) {
          player.currentTime = request.time;
          player.play();
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "Video player not found" });
        }
      }

})