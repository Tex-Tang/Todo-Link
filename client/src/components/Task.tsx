import { HTMLMotionProps, motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { ITaskResponse } from "../api/response";

export interface TaskProps extends Omit<HTMLMotionProps<"div">, "onSelect"> {
  task: ITaskResponse;
  onCheck: (task: ITaskResponse) => void;
  onSelect: (task: ITaskResponse) => void;
}

const Task: React.FC<TaskProps> = ({ task, onCheck, onSelect }) => {
  return (
    <motion.div
      tabIndex={1}
      id={`task-${task.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="task w-full mb-2 text-white p-3 rounded-lg px-4 todo focus:outline-none focus:border-white"
      style={{
        background: "rgba(0, 0, 0, 0.1)",
      }}
      onClick={() => onSelect(task)}
    >
      <motion.div className="flex">
        <motion.div
          className="p-1 mr-2 relative z-10"
          onClick={(e) => {
            e.stopPropagation();
            onCheck(task);
          }}
        >
          {task.completed_at ? (
            <motion.div className="w-4 h-4 flex-shrink-0 flex-grow-0">
              <FaCheckCircle className="text-white" style={{ fontSize: "1rem" }} />
            </motion.div>
          ) : (
            <motion.div className="w-4 h-4 rounded-full border-2 border-white flex-shrink-0 flex-grow-0"></motion.div>
          )}
        </motion.div>

        <motion.p>{task.title}</motion.p>
      </motion.div>
    </motion.div>
  );
};
export default Task;
