type Props = {
  setPlayerRef: (ref: HTMLVideoElement) => void
  videoUrl: string
}

export default function VideoPlayer({ setPlayerRef, videoUrl }: Props) {
  return (
    <div className="vid-container">
      <video
        className="video"
        controls
        ref={setPlayerRef}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
