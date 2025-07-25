export default function Stich({
  video,
  segments,
  currentVIdeoTime,
}) {
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
                <input type="checkbox" />

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
    </>
  );
}



function SelectSegRender({
    segmentTitle,
    startTime,
    endTime,
    onClick,
  }) {
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