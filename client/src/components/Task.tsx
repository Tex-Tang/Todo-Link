import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { ITaskResponse } from "../lib/response";

export interface TaskProps {
  task: ITaskResponse;
  onCheck: (task: ITaskResponse) => void;
  onClick: (task: ITaskResponse) => void;
  onDelete: (task: ITaskResponse) => void;
}

const Task: React.FC<TaskProps> = ({ task, onCheck, onClick, onDelete }) => {
  return (
    <motion.div
      tabIndex={0}
      id={`task-${task.id}`}
      className="w-full mb-2 text-white p-3 rounded-lg px-4 todo focus:outline-none focus:border-white task"
      style={{
        background: "rgba(0, 0, 0, 0.1)",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick(task);
        } else if (e.key === "Backspace") {
          onDelete(task);
        }
      }}
      onClick={() => onClick(task)}
    >
      <motion.div className="flex">
        {task.is_completed ? (
          <motion.div
            onClick={() => onCheck(task)}
            className="w-4 h-4 mr-3 flex-shrink-0 flex-grow-0"
            style={{ marginTop: ".2rem" }}
          >
            <FaCheckCircle className="text-white" style={{ fontSize: "1rem" }} />
          </motion.div>
        ) : (
          <motion.div
            onClick={() => onCheck(task)}
            className="w-4 h-4 mr-3 rounded-full border-2 border-white flex-shrink-0 flex-grow-0"
            style={{ marginTop: ".2rem" }}
          ></motion.div>
        )}

        <motion.p>{task.title}</motion.p>
      </motion.div>
    </motion.div>
  );
};
export default Task;
