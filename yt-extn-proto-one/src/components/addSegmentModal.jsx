import { useState } from "react";
import { pb } from "../pb";

export default function AddSegmentModal({
  startTime,
  endTime,
  videoId,
  setStartTime,
  setEndTime,
  setIsSegmenting,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [segmentTitle, setSegmentTitle] = useState("");

  const segmentSubmitButtonHandler = async () => {
    const user_Id = pb.authStore.record.id;
    const video = await pb
      .collection("videos")
      .getFirstListItem(`videoId="${videoId}"`);

    console.log("segment video", video);

    const data = {
      user: user_Id,
      video: video.id,
      startTime: startTime,
      endTime: endTime,
      segmentTitle: segmentTitle,
      notes: "default_note_test",
    };

    try {
      const record = await pb.collection("segments").create(data);
      console.log("segment record created successfully");
      setIsOpen(false);
      setStartTime(null);
      setEndTime(null);
      setIsSegmenting(false);
    } catch (e) {
      console.log("segment record creation failed", e);
    }
  };

  return (
    <>
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-500 p-2 rounded-lg m-2 w-[250px] h-[50px] 
        hover:bg-red-600 hover:scale-110 transition-all duration-300 ease-in-out"
        >
          ADD SEGMENT
        </button>

        {isOpen && (
          <div className="fixed bg-black inset-0 bg-opacity-50 flex items-center justify-center z-40 flex-col">
            <div className="text-white">
              <div className="text-2xl font-bold text-red-500 p-2 m-2">
                Save This segment
              </div>
            </div>
            <div className="flex flex-row justify-center items-center p-1 m-1 space-x-2">
              <div className="flex items-center justify-center bg-red-500 p-2 m-1 rounded-lg text-white">
                From - {startTime} sec
              </div>
              <div className="flex items-center justify-center bg-red-500 p-2 m-1 rounded-lg text-white">
                To - {endTime} sec
              </div>
              <div className="flex items-center justify-center bg-red-500 p-2 m-1 rounded-lg text-white">
                Duration - {endTime - startTime} sec
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="GIVE A NAME OF THIS SEGMENT"
                className="h-[100px] w-[250px] rounded-lg"
                onChange={(e) => setSegmentTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-center items-center p-1 m-1">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-red-500 p-2 rounded-lg m-2 w-[100px] h-[50px] text-white hover:scale-110 transition-all duration-300 ease-in-out"
              >
                CLOSE
              </button>
              <button
                onClick={segmentSubmitButtonHandler}
                className="bg-red-500 p-2 rounded-lg m-2 w-[100px] h-[50px] text-white hover:scale-110 transition-all duration-300 ease-in-out"
              >
                ADD
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
