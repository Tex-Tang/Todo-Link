import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ITaskResponse } from "../api/response";

export interface TaskModalProps {
  task: ITaskResponse;
  onClose: () => void;
  onEdit: (task: ITaskResponse) => void;
  onDelete: (task: ITaskResponse) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onDelete, onEdit, onClose }) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (editable) {
      titleRef.current?.focus();
    }
  }, [editable]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "e") {
      setEditable(true);
      e.preventDefault();
    } else if (e.key === "Backspace" && !editable) {
      onDelete(task);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editable]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layoutId={task.id.toString()}
      className="task-modal w-full p-4"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onEdit(task);
        }}
      >
        <motion.div className="flex mb-2 justify-between items-center">
          <motion.h2 className="font-semibold">Task Detail</motion.h2>
          <AiOutlineCloseCircle onClick={() => onClose()} className="text-xl" />
        </motion.div>
        {!editable ? (
          <motion.p>{task.title}</motion.p>
        ) : (
          <input
            ref={titleRef}
            onChange={(e) => {
              task.title = e.target.value;
            }}
            defaultValue={task.title}
            type="text"
            placeholder="Title"
            className="bg-transparent mb-4 w-full border-gray-400 border rounded px-2 py-2 text-sm focus:border-white focus:outline-none"
          />
        )}
        <motion.div className="flex justify-end mt-2">
          <motion.button type="submit" className={`create-btn px-3 py-1 ${editable ? "" : "hidden"}`}>
            Done
          </motion.button>
          {!editable && (
            <>
              <motion.button type="button" onClick={() => setEditable(true)} className="create-btn px-3 py-1 mr-2">
                Edit
              </motion.button>
              <motion.button type="button" onClick={() => onDelete(task)} className="delete-btn text-red-500 px-3 py-1">
                Delete
              </motion.button>
            </>
          )}
        </motion.div>
      </form>
    </motion.div>
  );
};
export default TaskModal;
