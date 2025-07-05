import { useState } from "react";

export default function AddSegmentModal( { startTime, endTime, videoId } ) {
  const [isOpen, setIsOpen] = useState(false);

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
              <div className="text-2xl font-bold text-red-500 p-2 m-2">Save This segment</div>
            </div>
            <div className="flex flex-row justify-center items-center p-1 m-1 space-x-2">
                <div className="flex items-center justify-center bg-red-500 p-2 m-1 rounded-lg text-white">From - {startTime} sec</div>
                <div className="flex items-center justify-center bg-red-500 p-2 m-1 rounded-lg text-white">To - {endTime} sec</div>
                <div className="flex items-center justify-center bg-red-500 p-2 m-1 rounded-lg text-white">Duration - {endTime - startTime} sec</div>
            </div>
            <div>
                <input type="text" placeholder="GIVE A NAME OF THIS SEGMENT" className="h-[100px] w-[250px] rounded-lg" />
            </div>
            <div className="flex flex-row justify-center items-center p-1 m-1">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-red-500 p-2 rounded-lg m-2 w-[100px] h-[50px] text-white hover:scale-110 transition-all duration-300 ease-in-out"
              >
                CLOSE
              </button>
              <button className="bg-red-500 p-2 rounded-lg m-2 w-[100px] h-[50px] text-white hover:scale-110 transition-all duration-300 ease-in-out">
                ADD
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
