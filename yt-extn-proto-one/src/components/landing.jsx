import { useNavigate } from "react-router-dom";
import { pb } from "../pb";

export default function Landing() {
  const navigate = useNavigate();

  function isSignedIn() {
    // const token = localStorage.getItem("token");
    if ( pb.authStore.isValid) {
      navigate("/dashboard");
    } else {
      navigate("/signin");
    }
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="logoTitle logoDesc"
        >
          <circle
            cx="100"
            cy="100"
            r="75"
            stroke="#8B0000"
            strokeWidth="4"
            fill="#A52A2A"
          />

          <defs>
            <path
              id="petalShape"
              d="M100 50 C120 55, 125 70, 110 80 L100 90 L90 80 C75 70, 80 55, 100 50 Z"
            />
          </defs>

          <use
            href="#petalShape"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
            transform="rotate(0 100 100)"
          />
          <use
            href="#petalShape"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
            transform="rotate(45 100 100)"
          />
          <use
            href="#petalShape"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
            transform="rotate(90 100 100)"
          />
          <use
            href="#petalShape"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
            transform="rotate(135 100 100)"
          />
          <use
            href="#petalShape"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
            transform="rotate(180 100 100)"
          />
          <use
            href="#petalShape"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
            transform="rotate(225 100 100)"
          />
          <use
            href="#petalShape"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
            transform="rotate(270 100 100)"
          />
          <use
            href="#petalShape"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
            transform="rotate(315 100 100)"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold">S E G M I N T</h1>
      <div>
        <button
          className="bg-red-700 h-[50px] w-[250px] rounded-2xl text-white text-center text-2xl font-bold my-5"
          onClick={isSignedIn}
        >
          GET STARTED
        </button>
        <p>
          Don't have an Account? <code>SIGN UP</code> now.
        </p>
      </div>
      <p className="read-the-docs">Click on the logo to learn more.</p>
    </>
  );
}
