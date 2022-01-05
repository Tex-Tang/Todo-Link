import { useState } from "react";
import { MdClose } from "react-icons/md";
import { ITaskResponse } from "../lib/response";

export interface AddTaskModalProps {
  task?: ITaskResponse;
  onClose: () => void;
  onCreate: (task: ITaskResponse) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ task: defaultTask, onCreate, onClose }) => {
  const [task, setTask] = useState<ITaskResponse>(
    defaultTask || {
      id: Date.now(),
      title: "",
      is_completed: false,
    }
  );

  return (
    <form
      className="w-full bg-white z-10 p-4 task-modal"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(task);
      }}
    >
      <div className="flex mb-4 justify-between items-center">
        <h3 className="font-semibold">New Task</h3>
        <MdClose className="text-xl cursor-pointer" onClick={() => onClose()} />
      </div>

      <input
        onChange={(e) => {
          setTask({
            ...task,
            title: e.target.value,
          });
        }}
        type="text"
        placeholder="Title"
        className="bg-transparent mb-4 w-full border-gray-400 border rounded px-2 py-2 text-sm focus:border-white focus:outline-none"
      />

      <div className="flex justify-end">
        <button type="submit" className="create-btn text-smc px-4 py-1">
          Create
        </button>
      </div>
    </form>
  );
};
export default AddTaskModal;
