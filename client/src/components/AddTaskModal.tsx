import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useMutation } from "react-query";
import { ICreateTaskRequest } from "../api/request";
import { ITaskResponse } from "../api/response";
import { CreateTask } from "../api/tasks";
import useSession from "../hooks/useSession";

export interface AddTaskModalProps {
  task?: ITaskResponse;
  onClose: () => void;
  onCreate: (task: ITaskResponse) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ task: defaultTask, onCreate, onClose }) => {
  const { session } = useSession();
  useEffect(() => {
    if (session) {
      setValue("session_id", session.id);
    }
  }, [session]);

  const { register, handleSubmit, setValue } = useForm<ICreateTaskRequest>();

  const createTaskMutation = useMutation("create-task", (data: ICreateTaskRequest) => CreateTask(data), {
    onSuccess: (data: ITaskResponse) => {
      onCreate(data);
    },
  });

  return (
    <form
      className="w-full bg-white z-10 p-4 task-modal"
      onSubmit={handleSubmit((data: ICreateTaskRequest) => {
        createTaskMutation.mutate({
          ...data,
          session_id: session ? session.id : "",
        });
      })}
    >
      <div className="flex mb-4 justify-between items-center">
        <h3 className="font-semibold">New Task</h3>
        <MdClose className="text-xl cursor-pointer" onClick={() => onClose()} />
      </div>

      <input
        {...register("title", { required: true })}
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
