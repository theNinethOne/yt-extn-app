import { useEffect, useState } from "react";
import { pb } from "../pb";
import { useSkipToTime } from "../hooks/useSkipToTime";
import captureImg from "../assets/Capture.jpg";
import { useGetCurrentTime } from "../hooks/useGetCurrentTime";
import Navbar from "./navbar";
import { MdDeleteForever } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import SegmentDisp from "./segmentsDisp";
import Stich from "./stitch";
import SearchAdd from "./searchAdd";

export default function Dashboard({ videoId }) {
  const [video, setVideo] = useState();
  const [segments, setSegments] = useState();
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [currentDisp, setCurrentDisp] = useState("segments");
  const { skipToTime } = useSkipToTime();
  const { currentVIdeoTime } = useGetCurrentTime();

  console.log(currentVIdeoTime);

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

  function skipToNextSegment() {
    if (segments && segments.length > 0) {
      if (currentVIdeoTime <= segments[0].startTime) {
        skipToTime(segments[0].startTime);
        console.log("c1");
      } else if (currentVIdeoTime >= segments[segments.length - 1].endTime) {
        skipToTime(video.videoDuration);
        console.log("c2");
      } else {
        for (let i = 0; i < segments.length; i++) {
          if (
            currentVIdeoTime >= segments[i].endTime &&
            currentVIdeoTime <= segments[i + 1].startTime
          ) {
            skipToTime(segments[i + 1].startTime);
            console.log("c3");
            break;
          }
        }
      }
    } else {
      console.log("No segments found.");
    }
  }

  useEffect(() => {
    if (isAutoPlay) {
      skipToNextSegment();
    }
  }, [currentVIdeoTime]);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {/* <div>
          <div>
            {video ? (
              <div className="text-xl font-bold m-1 p-2">
                {video.videoTitle}
              </div>
            ) : (
              <div>Loading...</div>
            )}
            <div className="flex flex-row justify-between items-center p-1 m-1 text-sm">
              <p>This video is segmented by You & </p>
              <div class="flex -space-x-4 rtl:space-x-reverse">
                <img
                  class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src={captureImg}
                  alt=""
                />
                <img
                  class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src={captureImg}
                  alt=""
                />
                <img
                  class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src={captureImg}
                  alt=""
                />
                <img
                  class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src={captureImg}
                  alt=""
                />

                <img
                class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                src={captureImg}
                alt=""
              />
              <img
                class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                src={captureImg}
                alt=""
              />
              <img
                class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                src={captureImg}
                alt=""
              />
                <a
                  class="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                  href="#"
                >
                  +99
                </a>
              </div>
              <p>others..</p>
            </div>
          </div>

          <div>
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                class="sr-only peer"
                onClick={() => {
                  setIsAutoPlay(!isAutoPlay);
                }}
              />
              <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {isAutoPlay ? "Auto Play" : "Manual Play"}
              </span>
            </label>
          </div>

          <div className="flex flex-col justify-center items-center">
            {segments ? (
              segments.map((segment) => (
                <SegRender
                  onClick={() => {
                    skipToTime(segment.startTime);
                  }}
                  key={segment.id}
                  segmentTitle={segment.segmentTitle}
                  startTime={segment.startTime}
                  endTime={segment.endTime}
                  currentTime={currentVIdeoTime}
                  thumbnaillUrl={video.thumbnailUrl}
                />
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div> */}
        <div className="m-1">
          {currentDisp === "segments" && (
            <SegmentDisp
              video={video}
              segments={segments}
              currentVIdeoTime={currentVIdeoTime}
              skipToTime={skipToTime}
              isAutoPlay={isAutoPlay}
              setIsAutoPlay={setIsAutoPlay}
              SegRender={SegRender}
            />
          )}

          {currentDisp === "search" && (
            <SearchAdd/>
          )}

          {currentDisp === "stitch" && (
            <Stich
              video={video}
              segments={segments}
              currentVIdeoTime={currentVIdeoTime}
              setCurrentDisp={setCurrentDisp}
              skipToTime={skipToTime}
            />
          )}
        </div>

        <br />
        <Navbar currentDisp={currentDisp} setCurrentDisp={setCurrentDisp} />
      </div>
    </>
  );
}

function SegRender({
  segmentTitle,
  startTime,
  endTime,
  currentTime,
  thumbnaillUrl,
  onClick,
}) {
  const duration = endTime - startTime;
  const isPlayingNow = currentTime >= startTime && currentTime <= endTime;

  return (
    <>
      <div
        onClick={onClick}
        className={`max-w-md w-[250px] divide-y divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700 hover:scale-110 transition-all duration-300 ease-in-out ${
          isPlayingNow ? "bg-red-500" : ""
        }`}
      >
        <li className="py-3 sm:py-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* <div className="shrink-0">
              <img
                className="w-8 h-8 rounded-full"
                src={`${thumbnaillUrl}`}
                alt="Thumbnail image"
              />
            </div> */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {segmentTitle}
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                Duretion :: {duration} sec
              </p>
            </div>
            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              {startTime} sec
            </div>
            <div>
              <FaShare size={20} />
            </div>
            <div>
              <MdDeleteForever size={20} />
            </div>
          </div>
        </li>
      </div>
    </>
  );
}
