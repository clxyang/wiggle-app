import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import NoteSidebar from '../components/NoteSidebar'

type Note = {
  id: string
  time: number
  text: string
}

export default function VideoPage() {
  const { rehearsalName } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const stateVideoUrl = (location.state as { videoUrl: string })?.videoUrl

  const [notes, setNotes] = useState<Note[]>([])
  const [videoUrl, setVideoUrl] = useState<string | null>(stateVideoUrl || null)
  const [loading, setLoading] = useState(true)
  const [playerRef, setPlayerRef] = useState<HTMLVideoElement | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!rehearsalName) return

      if (!stateVideoUrl) {
        const { data, error } = await supabase
          .from('videos')
          .select('video_url')
          .eq('title', rehearsalName)
          .single()

        if (error) {
          console.error('Error fetching video URL:', error)
          return
        }
        if (data) setVideoUrl(data.video_url)
      }

      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('video_id', rehearsalName)
        .order('time')

      if (notesError) console.error(notesError)
      else setNotes(notesData)

      setLoading(false)
    }

    fetchData()
  }, [rehearsalName, stateVideoUrl])

  const handleAddNote = async () => {
    if (!playerRef || !rehearsalName) return
    const time = playerRef.currentTime
    const text = prompt('Enter your note')
    if (text) {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ text, time, video_id: rehearsalName }])
        .select()

      if (error) console.error(error)
      else setNotes([...notes, ...data])
    }
  }

  const handleJumpTo = (time: number) => {
    if (playerRef) {
      playerRef.currentTime = time
      playerRef.play()
    }
  }

  if (loading || !videoUrl) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading video...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back to Home
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-6">{rehearsalName}</h1>

        {/* Video */}
        <VideoPlayer setPlayerRef={setPlayerRef} videoUrl={videoUrl} />

        {/* Add Note Button */}
        <button
          onClick={handleAddNote}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Note at Current Time
        </button>
      </div>

      {/* Notes Sidebar */}
      <NoteSidebar notes={notes} onJumpTo={handleJumpTo} />
    </div>
  )
}
