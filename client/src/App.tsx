import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsKeyboard, BsPlusLg, BsShare } from "react-icons/bs";
import { useQuery } from "react-query";
import { IUpdateTaskRequest } from "./api/request";
import { ITaskResponse } from "./api/response";
import { DeleteTask, ListTasks, UpdateTask } from "./api/tasks";
import AddTaskModal from "./components/AddTaskModal";
import KeyboardDropdown from "./components/KeyboardDropdown";
import Task from "./components/Task";
import TaskModal from "./components/TaskModal";
import useSession from "./hooks/useSession";

const getTaskElementId = (dir: string, id: string) => {
  const currentElement = document.getElementById(`task-${id}`);
  if (currentElement) {
    const elements = document.getElementsByClassName("task");
    let index = 0;
    for (let element of elements) {
      if (element.id === currentElement.id) {
        break;
      }
      index++;
    }

    if (dir === "prev" && elements[index - 1]) {
      return elements[index - 1].id.replace("task-", "");
    } else if (dir === "next" && elements[index + 1]) {
      return elements[index + 1].id.replace("task-", "");
    } else {
      return id;
    }
  }
};

const focusTaskElement = (id: string) => {
  const element = document.getElementById("task-" + id);
  if (element) {
    element.focus();
  }
};

const focusTask = (dir: string, id: string) => {
  const nextId = getTaskElementId(dir, id);
  if (nextId) focusTaskElement(nextId);
};

function App() {
  const { session } = useSession();

  const { data, refetch } = useQuery(["list-tasks", session], () =>
    session ? ListTasks({ session_id: session.id }) : null
  );

  const [selectedTask, setSelectedTask] = useState<ITaskResponse | null>(null);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "c" && selectedTask === null && !isTaskModalVisible) {
      setIsTaskModalVisible(true);
      e.preventDefault();
      document.querySelector("input")?.focus();
    }
    if (e.key === "Escape") {
      setIsTaskModalVisible(false);
      setSelectedTask(null);
    }

    if (document.activeElement?.id.includes("task")) {
      const currentId = document.activeElement.id.split("-")[1];
      if (e.key === "ArrowDown") {
        focusTask("next", currentId);
      } else if (e.key === "ArrowUp") {
        focusTask("prev", currentId);
      }

      const task = data?.find((task) => task.id === currentId);
      if (task) {
        if (e.key === "e") {
          e.preventDefault();
          setSelectedTask(task);
        } else if (e.key === "Backspace") {
          onDelete(task);
        } else if (e.key === "Enter") {
          onCheck(task);
        }
      }
    }
  };

  const onDelete = (task: ITaskResponse) => {
    const nextIdToFocus = getTaskElementId("next", task.id);
    DeleteTask(task.id).then(() => {
      refetch().then(() => {
        setSelectedTask(null);
        nextIdToFocus && focusTaskElement(nextIdToFocus);
      });
    });
  };

  const onCreate = (task: ITaskResponse) => {
    setIsTaskModalVisible(false);
    refetch().then(() => {
      const element = document.getElementById(`task-${task.id}`);
      if (element) {
        element.focus();
      }
    });
  };

  const onCheck = (task: ITaskResponse) => {
    const data: IUpdateTaskRequest = { title: task.title };
    if (!task.completed_at) {
      data.completed_at = new Date();
    }

    const nextIdToFocus = getTaskElementId("next", task.id);
    UpdateTask(task.id, data).then(() => {
      refetch().then(() => {
        nextIdToFocus && focusTaskElement(nextIdToFocus);
      });
    });
  };

  const onSelect = (task: ITaskResponse) => {
    setSelectedTask(task);
  };

  const onEdit = (task: ITaskResponse) => {
    if (selectedTask) {
      UpdateTask(selectedTask.id, task).then(() => {
        refetch().then(() => {
          focusTask("current", selectedTask.id);
          setSelectedTask(null);
        });
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTaskModalVisible, selectedTask, data]);

  return (
    <div className="app max-w-md mx-auto mt-2 sm:mt-6 md:mt-12 p-5 mb-4">
      <AnimatePresence>
        {isTaskModalVisible && (
          <div className="fixed top-32 max-w-md left-1/2 p-4 w-full md:w-1/2 -translate-x-1/2 z-10">
            <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
              <AddTaskModal
                onCreate={onCreate}
                onClose={() => {
                  setIsTaskModalVisible(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white font-bold text-xl tracking-widest">{session?.title}</h1>
        <div className="flex items-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + "/" + session?.id);
            }}
            className="text-white mr-4 text-md"
          >
            <BsShare />
          </button>
          <button className="keyboard-btn relative text-white text-xl p-1 focus:outline-none border border-transparent focus:border-white rounded-md">
            <BsKeyboard />
            <KeyboardDropdown />
          </button>
          <button
            onClick={() => {
              setIsTaskModalVisible(true);
            }}
            className="text-white text-md p-1 focus:outline-none border border-transparent focus:border-white rounded-md"
          >
            <BsPlusLg />
          </button>
        </div>
      </div>
      <h2 className="text-gray-300 uppercase font-semibold text-sm tracking-widest mb-2">Todo</h2>
      {data?.map((task) => (
        <AnimatePresence>
          {!task.completed_at && (
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Task onDelete={onDelete} onCheck={onCheck} onClick={onSelect} task={task}></Task>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <h2 className="text-gray-300 uppercase font-semibold text-sm tracking-widest mb-2 mt-4">Completed</h2>
      {data?.map((task) => (
        <AnimatePresence>
          {task.completed_at && (
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Task onDelete={onDelete} onCheck={onCheck} onClick={onSelect} task={task}></Task>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <div className="fixed top-32 max-w-md left-1/2 p-4 w-full md:w-1/2 -translate-x-1/2 z-10">
        {selectedTask && (
          <TaskModal
            onDelete={onDelete}
            onEdit={onEdit}
            onClose={() => {
              setSelectedTask(null);
            }}
            task={selectedTask}
          />
        )}
      </div>
      {(selectedTask || isTaskModalVisible) && (
        <div
          className="fixed top-0 left-0 h-full w-full"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(3px)",
          }}
          onClick={() => {
            setSelectedTask(null);
            setIsTaskModalVisible(false);
          }}
        ></div>
      )}
    </div>
  );
}

export default App;
