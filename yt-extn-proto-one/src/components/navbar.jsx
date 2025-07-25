import { PiLineSegmentsBold } from "react-icons/pi";
import { FaSearchPlus } from "react-icons/fa";
import { GiSewingNeedle } from "react-icons/gi";
import { BsScissors } from "react-icons/bs";

export default function Navbar({ currentDisp, setCurrentDisp }) {
  return (
    <>
      <div className="flex flex-row justify-center items-center h-[15%] w-full space-x-4 p-4 fixed bottom-0 bg-black">
        <div
          onClick={() => setCurrentDisp("segments")}
          className={`m-4 p-4 w-1/5 rounded-2xl hover:scale-110 transition-all duration-300 ease-in-out ${
            currentDisp === "segments" ? "bg-red-500" : "bg-black"
          } `}
        >
          <PiLineSegmentsBold size={20} />
        </div>
        <div
          onClick={() => setCurrentDisp("search")}
          className={`m-4 p-4 w-1/5 rounded-2xl hover:scale-110 transition-all duration-300 ease-in-out ${
            currentDisp === "search" ? "bg-red-500" : "bg-black"
          } `}
        >
          <FaSearchPlus size={20} />
        </div>
        <div
          onClick={() => setCurrentDisp("stitch")}
          className={`m-4 p-4 w-1/5 rounded-2xl hover:scale-110 transition-all duration-300 ease-in-out ${
            currentDisp === "stitch" ? "bg-red-500" : "bg-black"
          } `}
        >
          <GiSewingNeedle size={20} />
        </div>
        <div className="m-4 p-4 w-1/5 rounded-2xl border-4 border-black hover:border-4 hover:border-red-500">
          <BsScissors size={20} />
        </div>
      </div>
    </>
  );
}
