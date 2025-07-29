import { useState } from "react";
import { pb } from "../pb";

export default function Stich({
  video,
  segments,
  currentVIdeoTime,
  setCurrentDisp
}) {
  const [startTimings, setStartTimiings] = useState([]);
  const [endTimings, setEndTimiings] = useState([]);

  return (
    <>
      <div className="mb-10">
        <div>
          {video ? (
            <div className="text-xl font-bold m-1 p-2">{video.videoTitle}</div>
          ) : (
            <div>Loading...</div>
          )}
        </div>

        <div className="flex flex-col justify-center items-center">
          {segments ? (
            segments.map((segment) => (
              <div className="flex flex-row">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    console.log(e.target.checked);
                    if (e.target.checked) {
                      setStartTimiings((prev) => [...prev, segment.startTime]);
                      setEndTimiings((prev) => [...prev, segment.endTime]);
                    } else {
                      setStartTimiings((prev) =>
                        prev.filter((id) => id !== segment.startTime)
                      );
                      setEndTimiings((prev) =>
                        prev.filter((id) => id !== segment.endTime)
                      );
                    }
                  }}
                />

                <SelectSegRender
                  onClick={() => {
                    // skipToTime(segment.startTime);
                  }}
                  key={segment.id}
                  segmentTitle={segment.segmentTitle}
                  startTime={segment.startTime}
                  endTime={segment.endTime}
                  currentTime={currentVIdeoTime}
                  thumbnaillUrl={video.thumbnailUrl}
                />
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>

      <AddStichModal
        createdBy={pb.authStore.record?.id}
        originalVideo={video.id}
        startTimings={startTimings.toString()}
        endTimings={`${endTimings}`}
        videoDuration={video.videoDuration}

      />
    </>
  );
}

function SelectSegRender({ segmentTitle, startTime, endTime, onClick }) {
  const duration = endTime - startTime;

  return (
    <>
      <div
        onClick={onClick}
        className={`max-w-md w-[250px] divide-y divide-gray-200 border-b border-gray-200`}
      >
        <li className="py-3 sm:py-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {segmentTitle}
              </p>
              <p className="text-sm text-gray-500 truncate">
                Duretion :: {duration} sec
              </p>
            </div>
            <div className="inline-flex items-center text-base font-semibold text-white">
              {startTime} sec
            </div>
          </div>
        </li>
      </div>
    </>
  );
}

function AddStichModal(
  {createdBy,
  originalVideo,
  startTimings,
  endTimings,
  videoDuration}

) {
  const [stichName, setStichName] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addStichHandler = async () => {
    console.log(startTimings);
    console.log(endTimings);

    const stichData = {
      createdBy: createdBy,
      originalVideo: originalVideo,
      startTimings: startTimings,
      endTimings: endTimings,
      videoDuration: videoDuration,
      stichName: stichName,
    };

    try {
      console.log("stichData",stichData);

      const res = await pb.collection("stich").create(stichData);

      console.log("Stich added successfully, stichId : ", res.id);

      console.log("res", res)

      const stichShareData = {
        stichId: res.id,
        user: pb.authStore.record.id,
      };

      try {
        console.log(stichShareData);

        await pb.collection("stichShare").create(stichShareData);

        console.log("Stich share added successfully");
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.log(error);
    }

    // setCurrentDisp("search");
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="p-2 rounded-lg m-2 bg-red-500 text-white 
                        hover:bg-red-600 hover:scale-110 transition-all duration-300 ease-in-out"
        onClick={() => setIsOpen(true)}
      >
        Stich
      </button>

      {isOpen && (
        <div className="fixed bg-black inset-0 bg-opacity-50 flex items-center justify-center z-40 flex-col">
          <input
            type="text"
            placeholder="Stich Name"
            className="h-[100px] w-[250px] rounded-lg border-2 border-red-500"
            onChange={(e) => setStichName(e.target.value)}
          />
          <div className="flex flex-row justify-center items-center p-1 m-1 space-x-2">
            <button
              className="bg-red-500 p-2 rounded-lg m-2 w-[100px] h-[50px] text-white 
            hover:scale-110 transition-all duration-300 ease-in-out"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            <button
              className="bg-red-500 p-2 rounded-lg m-2 w-[100px] h-[50px] text-white 
            hover:scale-110 transition-all duration-300 ease-in-out"
              onClick={() => addStichHandler()}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </>
  );
}
