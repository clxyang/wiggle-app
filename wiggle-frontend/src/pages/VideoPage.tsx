import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import NoteSidebar from '../components/NoteSidebar'

type Note = {
  id: string
  time: number
  text: string
}

export default function VideoPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [playerRef, setPlayerRef] = useState<HTMLVideoElement | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase.from('notes').select('*').order('time')
      if (error) console.error(error)
      else setNotes(data)
    }

    fetchNotes()
  }, [])

  const handleAddNote = async () => {
    if (!playerRef) return
    const time = playerRef.currentTime
    const text = prompt('Enter your note')
    if (text) {
      const { data, error } = await supabase.from('notes').insert([{ text, time, video_id: 'rehearsal1' }]).select()
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

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4">
        <VideoPlayer setPlayerRef={setPlayerRef} />
        <button onClick={handleAddNote} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Add Note at Current Time
        </button>
      </div>
      <NoteSidebar notes={notes} onJumpTo={handleJumpTo} />
    </div>
  )
}
