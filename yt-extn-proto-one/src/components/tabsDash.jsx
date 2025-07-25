import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../pb";
import { useSegment } from "../hooks/useSegment";
import AddSegmentModal from "./addSegmentModal";
import Dashboard from "./dashboard";

export default function TabsDash() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current"); // default tab

  const [render, setRender] = useState(null);
  const [profile, setProfile] = useState();
  const [isSegmenting, setIsSegmenting] = useState(false);
  const { time, segmentHandler, error, loading } = useSegment();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  function refreshUponSubmit() {
    setStartTime(null);
    setEndTime(null);
    setIsSegmenting(false);
  }

  async function getSegment() {
    const currentTime = await segmentHandler();

    if (isSegmenting) {
      setEndTime(Math.trunc(currentTime.currentVideoTime));
    } else {
      setStartTime(Math.trunc(currentTime.currentVideoTime));
      setEndTime(null);
    }

    setIsSegmenting(!isSegmenting);
  }

  async function inJectScript(tabId) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ["script.js"],
    });
  }

  async function getYoutubeData(type) {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await inJectScript(tab.id);

    await new Promise((res) => setTimeout(res, 300));

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
        setRender(response.data);
        console.log("Received YouTube Data:", response.data);
      } else {
        console.log("No valid YOUTUBE_METADATA response from script.js.");
      }
    } catch (error) {
      console.error("Error sending message or receiving response:", error);
    }
  }

  const addVideoToPlaylist = async (render) => {
    const data = {
      videoUrl: render.videoUrl,
      videoId: render.videoId,
      videoTitle: render.videoTitle,
      channelName: render.channelName,
      videoDuration: render.videoDuration,
      thumbnailUrl: render.thumbnailUrl,
    };

    let isVideoExisting = false;

    try {
      await pb
        .collection("videos")
        .getFirstListItem(`videoId="${render?.videoId}"`);
      isVideoExisting = true;
    } catch (e) {
      if (e.status === 404) {
        isVideoExisting = false;
      } else {
        console.error("Error while checking for existing video:", e);
        return;
      }
    }

    if (!isVideoExisting && data) {
      try {
        const record = await pb.collection("videos").create(data);
        console.log("Video record created successfully:", record);
      } catch (e) {
        console.error("Video record creation failed:", e);
      }
    } else {
      console.log("Video already exists, skipping creation.");
    }
  };

  useEffect(() => {
    getYoutubeData("GET_DATA");
  }, []);

  useEffect(() => {
    if (render) {
      addVideoToPlaylist(render);
    }
  }, [render]);

  return (
    <>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 h-auto">
        <ul className="flex items-center justify-between flex-wrap -mb-px text-sm font-medium text-center">
          <li className="me-1">
            <button
              className={`inline-block p-2 border-b-2 rounded-t-lg ${
                activeTab === "current"
                  ? "border-red-500 text-red-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => {
                setActiveTab("current");
                // getYoutubeData("GET_DATA");
              }}
            >
              Current
            </button>
          </li>

          <li className="me-1">
            <button
              className={`inline-block p-2 border-b-2 rounded-t-lg ${
                activeTab === "dashboard"
                  ? "border-red-500 text-red-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
          </li>

          <li className="me-1">
            <button
              className={`inline-block p-2 border-b-2 rounded-t-lg ${
                activeTab === "profile"
                  ? "border-red-500 text-red-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => {
                setActiveTab("profile");
                setProfile(pb.authStore.record);
              }}
            >
              Profile
            </button>
          </li>
        </ul>
      </div>

      <div>
        {activeTab === "current" && (
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 w-[300px]">
            {render ? (
              <MetaDataRenderer
                videoTitle={render?.videoTitle}
                channelName={render?.channelName}
                videoId={render?.videoId}
                currentVideoTime={render?.currentVideoTime}
                videoDuration={render?.videoDuration}
                thumbnailUrl={render?.thumbnailUrl}
              />
            ) : (
              <div>Loading...</div>
            )}

            <div className="flex flex-col justify-center items-center">
              <button
                className={`p-2 rounded-lg m-2 w-[250px] h-[50px] 
             ${
               isSegmenting
                 ? "bg-red-500 text-white hover:bg-red-600 hover:scale-110 transition-all duration-300 ease-in-out"
                 : "bg-red-500 text-white hover:bg-red-600 hover:scale-110 transition-all duration-300 ease-in-out"
             }`}
                onClick={getSegment}
              >
                {isSegmenting ? "STOP" : "START"}
              </button>

              <div className="flex flex-row justify-center items-center p-1 m-1">
                {startTime ? (
                  <div className="bg-red-500 p-2 m-2 rounded-lg text-white">
                    {startTime} SEC
                  </div>
                ) : (
                  <div className="bg-black p-2 m-2 rounded-lg border-2 border-red-600 text-red-600">
                    00 SEC
                  </div>
                )}
                {endTime ? (
                  <div className="bg-red-500 p-2 m-2 rounded-lg text-white">
                    {endTime} SEC{" "}
                  </div>
                ) : (
                  <div className="bg-black p-2 m-2 rounded-lg border-2 border-red-600 text-red-600">
                    XX SEC
                  </div>
                )}
                <div></div>
                <button
                  className="bg-red-500 p-2 rounded-lg m-2 w-[50px] h-[50px] text-white hover:scale-110 transition-all duration-300 ease-in-out"
                  onClick={() => {
                    setStartTime(null);
                    setEndTime(null);
                    setIsSegmenting(false);
                  }}
                >
                  RESET
                </button>
              </div>

              {endTime && (
                <AddSegmentModal
                  startTime={startTime}
                  endTime={endTime}
                  videoId={render?.videoId}
                  setStartTime={setStartTime}
                  setEndTime={setEndTime}
                  setIsSegmenting={setIsSegmenting}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 w-[300px]">
            <Dashboard videoId={render?.videoId} />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 w-[300px]">
            <ProfileRenderer props={profile} />
          </div>
        )}
      </div>
    </>
  );
}

function MetaDataRenderer({
  videoTitle,
  channelName,
  videoId,
  currentVideoTime,
  videoDuration,
  thumbnailUrl,
}) {
  if (!videoTitle) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <img
          src={thumbnailUrl}
          alt="thumbnail"
          // style={{ width: "100%", borderRadius: "6px" }}
          className="rounded-lg h-[150px] w-[250px] m-1"
        />
        <h3>{videoTitle}</h3>
        <p>
          <strong>Channel:</strong> {channelName}
        </p>
        {/* <p>
          <strong>Video ID:</strong> {videoId}
        </p> */}
        {/* <p>
          <strong>Current Time:</strong> {Math.floor(currentVideoTime)} sec
        </p> */}
        {/* <p>
          <strong>Duration:</strong> {Math.floor(videoDuration)} sec
        </p> */}
      </div>
    </>
  );
}

function ProfileRenderer({ props }) {
  return (
    <>
      <div>
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-end px-4 pt-4">
            <button
              id="dropdownButton"
              data-dropdown-toggle="dropdown"
              className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
              type="button"
            >
              <span className="sr-only">Open dropdown</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 3"
              >
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
              </svg>
            </button>

            <div
              id="dropdown"
              className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
            >
              <ul className="py-2" aria-labelledby="dropdownButton">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Edit
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Export Data
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center pb-10">
            <img
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src={
                props.avatar ? (
                  props.avatar
                ) : (
                  <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <svg
                      class="absolute w-12 h-12 text-gray-400 -left-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                )
              }
              alt="Bonnie image"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Welcome
            </span>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {props.name}
            </h5>
            <div className="flex mt-4 md:mt-6">
              <a
                href="#"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                LOG OUT
              </a>
              <a
                href="#"
                className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
