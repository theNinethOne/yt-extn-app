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
      <div>
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
  <div className="flex flex-row h-[50px] w-[200px] p-2 m-1 rounded-lg border-2 border-red-500 bg-black text-red-500 hover:bg-red-500 hover:text-black hover:scale-105 transition-all duration-300 ease-in-out">
    <div>P</div>
    <div>{segmentTitle}</div>
    <div>{duration}</div>
    <div>X</div>
  </div>
  </>
}