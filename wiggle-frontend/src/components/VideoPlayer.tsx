type Props = {
    setPlayerRef: (ref: HTMLVideoElement) => void
  }
  
  export default function VideoPlayer({ setPlayerRef }: Props) {
    return (
      <video
        className="w-full max-h-[500px] bg-black"
        controls
        ref={setPlayerRef}
      >
        <source src="/videos/rehearsal1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )
  }
  