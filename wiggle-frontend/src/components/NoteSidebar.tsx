type Note = {
    id: string
    time: number
    text: string
  }
  
  type Props = {
    notes: Note[]
    onJumpTo: (time: number) => void
  }
  
  export default function NoteSidebar({ notes, onJumpTo }: Props) {
    return (
      <div className="w-80 bg-gray-100 p-4 overflow-y-auto border-l border-gray-300">
        <h2 className="text-lg font-semibold mb-2">Notes</h2>
        {notes.map(note => (
          <div key={note.id} className="mb-2">
            <button
              onClick={() => onJumpTo(note.time)}
              className="note-timestamp-button"
            >
              [{note.time.toFixed(1)}s]
            </button>{' '}
            <span>{note.text}</span>
          </div>
        ))}
      </div>
    )
  }
  