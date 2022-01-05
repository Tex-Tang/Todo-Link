import { FaCheckCircle } from "react-icons/fa";
import { ITaskResponse } from "../lib/response";

export interface TaskProps {
  task: ITaskResponse;
  onCheck: (task: ITaskResponse) => void;
}

const Task: React.FC<TaskProps> = ({ task, onCheck }) => {
  return (
    <div
      className="w-full mb-2 text-white p-3 rounded-lg px-4 todo"
      style={{
        background: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex">
        {task.is_completed ? (
          <div
            onClick={() => onCheck(task)}
            className="w-4 h-4 mr-3 flex-shrink-0 flex-grow-0"
            style={{ marginTop: ".2rem" }}
          >
            <FaCheckCircle className="text-white" style={{ fontSize: "1rem" }} />
          </div>
        ) : (
          <div
            onClick={() => onCheck(task)}
            className="w-4 h-4 mr-3 rounded-full border-2 border-white flex-shrink-0 flex-grow-0"
            style={{ marginTop: ".2rem" }}
          ></div>
        )}

        <p>{task.title}</p>
      </div>
    </div>
  );
};
export default Task;
