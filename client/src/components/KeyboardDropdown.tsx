export default function KeyboardDropdown() {
  return (
    <div className="shortcuts-container p-2 absolute bot-0 -right-9 w-64 z-20 hidden">
      <div className="task-modal text-left w-full p-2 py-3 text-sm rounded-lg">
        <div className="flex items-center mb-2">
          <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">c</span> Create task
        </div>
        <div className="flex items-center mb-2">
          <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">&#x232b;</span> Delete task
        </div>
        <div className="flex items-center mb-2">
          <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">&uarr;</span> Previous task
        </div>
        <div className="flex items-center mb-2">
          <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">&darr;</span> Next task
        </div>
        <div className="flex items-center mb-2">
          <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">e</span> Edit
        </div>
        <div className="flex items-center mb-2">
          <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">Esc</span> Back
        </div>
        <div className="flex items-center mb-2">
          <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">Tab</span> Navigate around
        </div>
        <div className="flex items-center">
          <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">Enter</span> Mark as completed
        </div>
      </div>
    </div>
  );
}
