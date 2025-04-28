type Props = {
  setPlayerRef: (ref: HTMLVideoElement) => void
  videoUrl: string
}

export default function VideoPlayer({ setPlayerRef, videoUrl }: Props) {
  return (
    <div className="flex flex-col items-center">
      <video
        className="w-full h-auto max-w-3xl bg-black rounded"
        controls
        ref={setPlayerRef}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
