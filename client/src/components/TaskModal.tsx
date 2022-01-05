import { MdClose } from "react-icons/md";

export interface TaskModalProps {
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose }) => {
  return (
    <div className="w-full bg-white z-10 p-4 task-modal">
      <div className="flex mb-4 justify-between items-center">
        <h3 className="font-semibold">New Task</h3>
        <MdClose className="text-xl cursor-pointer" onClick={() => onClose()} />
      </div>

      <input
        type="text"
        placeholder="Title"
        className="bg-transparent mb-4 w-full border-gray-400 border rounded px-2 py-2 text-sm focus:border-white focus:outline-none"
      />

      <div className="flex justify-end">
        <button className="create-btn text-smc px-4 py-1">Create</button>
      </div>
    </div>
  );
};
export default TaskModal;
