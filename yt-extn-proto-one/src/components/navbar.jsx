import { PiLineSegmentsBold } from "react-icons/pi";
import { FaSearchPlus } from "react-icons/fa";
import { GiSewingNeedle } from "react-icons/gi";
import { BsScissors } from "react-icons/bs";

export default function Navbar() {
  return (
    <>
      <div className="flex flex-row justify-center items-center h-[15%] w-full space-x-4 p-4 fixed bottom-0 bg-black">
        <div className="m-4 p-4 w-1/5 rounded-2xl border-4 border-black hover:border-4 hover:border-red-500">
          <PiLineSegmentsBold size={20} />
        </div>
        <div className="m-4 p-4 w-1/5 rounded-2xl border-4 border-black hover:border-4 hover:border-red-500">
          <FaSearchPlus size={20} />
        </div>
        <div className="m-4 p-4 w-1/5 rounded-2xl border-4 border-black hover:border-4 hover:border-red-500">
          <GiSewingNeedle size={20} />
        </div>
        <div className="m-4 p-4 w-1/5 rounded-2xl border-4 border-black hover:border-4 hover:border-red-500">
          <BsScissors size={20} />
        </div>
      </div>
    </>
  );
}
