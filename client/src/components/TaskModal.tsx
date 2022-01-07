import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useMutation } from "react-query";
import { IUpdateTaskRequest } from "../api/request";
import { ITaskResponse } from "../api/response";
import { UpdateTask } from "../api/tasks";

export interface TaskModalProps {
  editable?: boolean;
  task: ITaskResponse;
  onClose: () => void;
  onEdit: (task: ITaskResponse) => void;
  onDelete: (task: ITaskResponse) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ editable: defaultEditable, task, onDelete, onEdit, onClose }) => {
  const [editable, setEditable] = useState(defaultEditable || false);
  useEffect(() => {
    setEditable(defaultEditable || false);
  }, [defaultEditable]);

  useEffect(() => {
    setValue("title", task.title);
  }, [task]);

  useEffect(() => {
    if (editable) {
      document.getElementById("title-input")?.focus();
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

  const { register, handleSubmit, setValue } = useForm<IUpdateTaskRequest>({ defaultValues: { title: task.title } });

  const updateTaskMutation = useMutation(
    ["update-task", task.id],
    (data: IUpdateTaskRequest) => UpdateTask(task.id, data),
    {
      onSuccess: (data) => {
        onEdit(data);
        setEditable(false);
      },
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layoutId={task.id.toString()}
      className="task-modal w-full p-4"
    >
      <form onSubmit={handleSubmit((data) => updateTaskMutation.mutate(data))}>
        <motion.div className="flex mb-2 justify-between items-center">
          <motion.h2 className="font-semibold">Task Detail</motion.h2>
          <AiOutlineCloseCircle onClick={() => onClose()} className="text-xl" />
        </motion.div>
        {!editable ? (
          <motion.p>{task.title}</motion.p>
        ) : (
          <input
            {...register("title", { required: true })}
            id="title-input"
            disabled={updateTaskMutation.isLoading}
            type="text"
            placeholder="Title"
            className="bg-transparent mb-4 w-full border-gray-400 border rounded px-2 py-2 text-sm focus:border-white focus:outline-none"
          />
        )}
        <motion.div className="flex justify-end mt-2">
          <motion.button type="submit" className={`create-btn px-3 py-1 ${editable ? "" : "hidden"}`}>
            {updateTaskMutation.isLoading ? "Saving..." : "Save"}
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
