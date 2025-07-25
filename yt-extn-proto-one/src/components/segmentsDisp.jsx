export default function SegmentDisp({
  video,
  isAutoPlay,
  setIsAutoPlay,
  segments,
  SegRender,
  skipToTime,
  currentVIdeoTime,
}) {
  return (
    <>
      <div className="flex flex-col justify-center items-center mb-10">
        <div>
          {video ? (
            <div className="text-xl font-bold m-1 p-2">{video.videoTitle}</div>
          ) : (
            <div>Loading...</div>
          )}
        </div>

        {/* <div>
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
        </div> */}

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
      </div>
    </>
  );
}
