import { useEffect, useState } from "react";
import { pb } from "../pb";
import { useSkipToTime } from "../hooks/useSkipToTime";

export default function Dashboard({ videoId }) {
  const [video, setVideo] = useState();
  const [segments, setSegments] = useState();
  const { skipToTime } = useSkipToTime();

  const getCurrrentVideoData = async (videoId) => {
    try {
      const videoData = await pb
        .collection("videos")
        .getFirstListItem(`videoId="${videoId}"`);
      setVideo(videoData);

      await new Promise((res) => setTimeout(res, 300));

      console.log(pb.authStore.record?.id, videoData.id);

      const segmentData = await pb.collection("segments").getList(1, 30, {
        filter: `video="${videoData.id}" && user="${pb.authStore.record?.id}"`,
        sort: "startTime",
      });

      console.log(segmentData);
      setSegments(segmentData.items);
    } catch (e) {
      console.log(" videoData error", e);
    }
  };

  useEffect(() => {
    if (videoId) {
      getCurrrentVideoData(videoId);
    }
  }, [videoId]);

  return (
    <>
      <div>
        <div>
        {video ? <div className="text-xl font-bold m-1 p-2">{video.videoTitle}</div> : <div>Loading...</div>}
        
<div class="flex -space-x-4 rtl:space-x-reverse">
    <img class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="" alt=""/>
    <img class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="" alt=""/>
    <img class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="" alt=""/>
    <img class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="" alt=""/>
</div>
<div class="flex -space-x-4 rtl:space-x-reverse">
    <img class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="" alt=""/>
    <img class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="" alt=""/>
    <img class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="" alt=""/>
    <a class="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="#">+99</a>
</div>

        </div>
        <div className="flex flex-col justify-center items-center">
          {segments ? (
            segments.map((segment) => (
              <SegRender
                onClick={() => {
                  console.log("c1");
                  skipToTime(segment.startTime);
                  console.log("c2");
                }}
                key={segment.id}
                segmentTitle={segment.segmentTitle}
                startTime={segment.startTime}
                endTime={segment.endTime}
                thumbnaillUrl={video.thumbnailUrl}
              />
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </>
  );
}

function SegRender({ segmentTitle, startTime, endTime, thumbnaillUrl, onClick }) {
  const duration = endTime - startTime;

  return (
    <>
      <div
        onClick={onClick}
        // className="group flex flex-row justify-between items-center h-[50px] w-[250px] p-2 m-2 rounded-lg space-x-2 text-white font-mono text-xl scroll-auto hover:bg-red-500 hover:text-black hover:scale-105 transition-all duration-300 ease-in-out">

        className="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
      >
        <li className="py-3 sm:py-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="shrink-0">
            <img className="w-8 h-8 rounded-full" src={`${thumbnaillUrl}`} alt="Thumbnail image"/>
         </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {segmentTitle}
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                Duretion: {duration} sec
              </p>
            </div>
            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              {startTime} sec
            </div>
          </div>
        </li>
      </div>
    </>
  );
}
