"use client"
import { PlusIcon, TrashIcon } from "../../components/Icons"

const NotesSection = ({
  quotationData = { notes: [""] }, // Default with one empty note
  handleNoteChange = () => {},
  addNote = () => {},
  removeNote = () => {},
}) => {
  // Safely get notes array with fallback to one empty note
  const notes = quotationData.notes || [""]

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Notes</h3>
      <div className="space-y-4">
        {notes.map((note, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={note || ""} // Fallback for undefined/null
              onChange={(e) => handleNoteChange(index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter note"
            />
            {notes.length > 1 && ( // Only show delete if more than one note
              <button 
                type="button" 
                onClick={() => removeNote(index)} 
                className="text-red-500 hover:text-red-700 p-2"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addNote}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" /> Add Note
        </button>
      </div>
    </div>
  )
}

export default NotesSection