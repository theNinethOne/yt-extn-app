import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../pb";
import { useSegment } from "../hooks/useSegment";
import AddSegmentModal from "./addSegmentModal";

export default function TabsDash() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current"); // default tab

  const [render, setRender] = useState(null);
  const [profile, setProfile] = useState();
  const [isSegmenting, setIsSegmenting] = useState(false);
  const { time, segmentHandler, error, loading } = useSegment();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  async function getSegment() {
    const currentTime = await segmentHandler();

    if (isSegmenting) {
      setEndTime( Math.trunc(currentTime.currentVideoTime));
    } else {
      setStartTime( Math.trunc(currentTime.currentVideoTime));
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

  useEffect(() => {
    getYoutubeData("GET_DATA");
  }, []);

  return (
    <>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
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
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 w-[300px]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This is some placeholder content for the{" "}
              <strong className="font-medium text-gray-800 dark:text-white">
                Dashboard tab
              </strong>
              .
            </p>
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
        <h1>{props.name}</h1>
        <button>Logout</button>
      </div>
    </>
  );
}
