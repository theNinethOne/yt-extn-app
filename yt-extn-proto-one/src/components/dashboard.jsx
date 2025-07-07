import { useEffect, useState } from "react"
import { pb } from "../pb"

export default function Dashboard ( { videoId } ) {

  const [ video, setVideo] = useState()
  const [ segments, setSegments ] = useState()

  const getCurrrentVideoData = async ( videoId ) => {

    try {
      
      const videoData = await pb.collection("videos").getFirstListItem(`videoId="${videoId}"`)
      setVideo(videoData)
      
      await new Promise((res) => setTimeout(res, 300))

      console.log(pb.authStore.record?.id, videoData.id)
      
      const segmentData = await pb.collection("segments").getList(1,30,{filter: `video="${videoData.id}" && user="${pb.authStore.record?.id}"`})

      console.log(segmentData)
      setSegments(segmentData.items)

    } catch (e) {
      console.log(" videoData error", e)
    }

  }

  useEffect( () => {
    if ( videoId ){
      getCurrrentVideoData( videoId)
    }
  }, [ videoId ] )
  
  return(
    <>
    <div>
      { video ? <div>{ video.videoTitle }</div> : <div>Loading...</div> }
      <div className="flex flex-col justify-center items-center">
        { segments ? segments.map( (segment) => (
           <SegRender key={segment.id} segmentTitle={segment.segmentTitle} startTime={segment.startTime} endTime={segment.endTime} />
        )
        ) : <div>Loading...</div> }
      </div>
    </div>
    </>
  )
}

function SegRender( { segmentTitle, startTime, endTime } ) {

  const duration = endTime - startTime

  return<>
  <div className="group flex flex-row justify-between items-center h-[50px] w-[250px] p-2 m-2 rounded-lg space-x-2 text-white font-mono text-xl scroll-auto hover:bg-red-500 hover:text-black hover:scale-105 transition-all duration-300 ease-in-out">
    <div className="flex justify-between items-center h-[40px] w-[40px] p-2 m-1 rounded-lg bg-slate-600 group-hover:bg-red-500 group-hover:text-black group-hover:scale-105 transition-all duration-300 ease-in-out">P</div>
    <div className="flex justify-between items-center h-[40px] w-[150px] p-2 m-1 rounded-lg overflow-hidden text-white font-mono bg-slate-600 group-hover:bg-red-500 group-hover:text-black group-hover:scale-105 transition-all duration-300 ease-in-out">{segmentTitle}</div>
    <div className="flex justify-between items-center h-[40px] w-[40px] p-2 m-1 rounded-lg bg-slate-600 group-hover:bg-red-500 group-hover:text-black group-hover:scale-105 transition-all duration-300 ease-in-out">{duration}</div>
    <div className="flex justify-between items-center h-[40px] w-[40px] p-2 m-1 rounded-lg bg-slate-600 group-hover:bg-red-500 group-hover:text-black group-hover:scale-105 transition-all duration-300 ease-in-out">X</div>
  </div>
  </>
}