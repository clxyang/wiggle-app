type Note = {
    id: string
    time: number
    text: string
  }
  
  type Props = {
    note: Note
    onJumpTo: (time: number) => void
  }
  
  export default function NoteItem({ note, onJumpTo }: Props) {
    return (
      <div className="mb-2 p-2 bg-white shadow rounded hover:bg-gray-50 transition">
        <button
          onClick={() => onJumpTo(note.time)}
          className="text-blue-600 font-mono text-sm hover:underline"
        >
          [{note.time.toFixed(1)}s]
        </button>
        <p className="text-sm mt-1">{note.text}</p>
      </div>
    )
  }
  