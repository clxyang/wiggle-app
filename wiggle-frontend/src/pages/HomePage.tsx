import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type Rehearsal = {
  id: string
  title: string
  video_url: string
}

export default function HomePage() {
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([])
  const [title, setTitle] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRehearsals = async () => {
      const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
      if (error) {
        console.error('Error fetching videos:', error)
      } else {
        setRehearsals(data)
      }
      setLoading(false)
    }

    fetchRehearsals()
  }, [])

  const handleAddRehearsal = async () => {
    if (!title.trim() || !videoFile) {
      alert('Please enter a title and upload a video file.')
      return
    }

    // Upload the video file to Supabase Storage
    const fileExt = videoFile.name.split('.').pop()
    const fileName = `${title}-${Date.now()}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('rehearsal-videos')
      .upload(fileName, videoFile)

    if (uploadError) {
      console.error('Error uploading video:', uploadError)
      alert('Failed to upload video.')
      return
    }

    // Get public URL for the uploaded video
    const { data: publicUrlData } = supabase.storage
      .from('rehearsal-videos')
      .getPublicUrl(fileName)

    const publicUrl = publicUrlData?.publicUrl
    if (!publicUrl) {
      alert('Could not retrieve public video URL.')
      return
    }

    // Insert rehearsal into database
    const { data, error } = await supabase
      .from('videos')
      .insert([{ title, video_url: publicUrl }])
      .select()

    if (error) {
      console.error('Error adding rehearsal:', error)
      alert('Failed to add rehearsal.')
    } else if (data && data.length > 0) {
      const newRehearsal = data[0]
      setRehearsals([newRehearsal, ...rehearsals])
      navigate(`/video/${encodeURIComponent(newRehearsal.title)}`, { state: { videoUrl: newRehearsal.video_url } })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading rehearsals...</div>
      </div>
    )
  }

  return (
    <div className="home-box">
      <h1 className="text-3xl font-bold mb-4">Welcome to Wiggle</h1>

      <div className="space-y-2">
        Upload a rehearsal video
        <br></br>
        <input
          className="border p-2 w-64"
          placeholder="Rehearsal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept="video/*"
          className="block"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
        />
        <br></br>
        <button
            onClick={handleAddRehearsal}
            className="rehearsal-upload-button"
            disabled={!videoFile}
        >
        Upload
        </button>

      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Existing Rehearsals:</h2>
        {rehearsals.length === 0 ? (
          <p className="text-gray-500">No rehearsals yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {rehearsals.map((rehearsal) => (
              <li key={rehearsal.id}>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() =>
                    navigate(`/video/${encodeURIComponent(rehearsal.title)}`, {
                      state: { videoUrl: rehearsal.video_url },
                    })
                  }
                >
                  {rehearsal.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
