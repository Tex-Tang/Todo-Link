import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsKeyboard, BsPlusLg } from "react-icons/bs";
import { useQuery } from "react-query";
import { IUpdateTaskRequest } from "./api/request";
import { ITaskResponse } from "./api/response";
import { DeleteTask, ListTasks, UpdateTask } from "./api/tasks";
import AddTaskModal from "./components/AddTaskModal";
import IconButton from "./components/IconButton";
import KeyboardDropdown from "./components/KeyboardDropdown";
import RefreshButton from "./components/RefreshButton";
import ShareButton from "./components/ShareButton";
import Task from "./components/Task";
import TaskModal from "./components/TaskModal";
import useSession from "./hooks/useSession";

const focusTaskElement = (id: string) => {
  const element = document.getElementById("task-" + id);
  if (element) {
    element.focus();
  }
};

function App() {
  const { session, isExternal, import: importSession } = useSession();

  const { isLoading } = useQuery(
    ["list-tasks", session],
    () => (session ? ListTasks({ session_id: session.id }) : null),
    {
      refetchInterval: 60 * 1000,
      onSuccess: (data) => {
        if (data) {
          setCompleted(data.filter((task) => task.completed_at));
          setIncompleted(data.filter((task) => !task.completed_at));
        } else {
          setCompleted([]);
          setIncompleted([]);
        }
      },
    }
  );

  const [completed, setCompleted] = useState<ITaskResponse[]>([]);
  const [incompleted, setIncompleted] = useState<ITaskResponse[]>([]);

  const [selectedTask, setSelectedTask] = useState<ITaskResponse | null>(null);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isTaskModalEditable, setIsTaskModalEditable] = useState(false);

  const getTaskElementId = (dir: string, id: string) => {
    const data = [...incompleted, ...completed];
    let index = 0;
    for (let task of data) {
      if (task.id === id) {
        break;
      }
      index++;
    }

    if (dir === "prev" && data[index - 1]) {
      return data[index - 1].id;
    } else if (dir === "next" && data[index + 1]) {
      return data[index + 1].id;
    } else {
      return id;
    }
  };

  const focusTask = (dir: string, id: string) => {
    const nextId = getTaskElementId(dir, id);
    if (nextId) focusTaskElement(nextId);
  };

  const focusNextTask = (id: string) => {
    let idToFocus = getTaskElementId("next", id);
    const data = [...incompleted, ...completed];
    const index = data.findIndex((task) => task.id === id);
    if ((index === 0 && incompleted.length === 1) || (index === incompleted.length && completed.length === 1)) {
      idToFocus = id;
    } else if (index === incompleted.length - 1 || index === data.length - 1) {
      idToFocus = getTaskElementId("prev", id);
    }
    idToFocus && focusTaskElement(idToFocus);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "c" && selectedTask === null && !isTaskModalVisible) {
      setIsTaskModalVisible(true);
      e.preventDefault();
      document.querySelector("input")?.focus();
    }
    if (e.key === "Escape" && (isTaskModalVisible || selectedTask)) {
      setIsTaskModalVisible(false);
      setIsTaskModalEditable(false);
      if (selectedTask) {
        focusTaskElement(selectedTask.id);
        setSelectedTask(null);
      }
    }

    if (document.activeElement?.id.includes("task")) {
      const currentId = document.activeElement.id.split("-")[1];
      if (e.key === "ArrowDown") {
        focusTask("next", currentId);
      } else if (e.key === "ArrowUp") {
        focusTask("prev", currentId);
      }

      const task =
        completed?.find((task) => task.id === currentId) || incompleted?.find((task) => task.id === currentId);
      if (task) {
        if (e.key === "e") {
          e.preventDefault();
          setSelectedTask(task);
          setIsTaskModalEditable(true);
        } else if (e.key === "Backspace") {
          if (task.id === completed?.[0]?.id && completed.length === 1) {
            focusTask("prev", task.id);
          } else if (task.id === incompleted?.[0]?.id && incompleted.length === 1) {
            focusTask("next", task.id);
          } else {
            focusNextTask(task.id);
          }
          onDelete(task);
        } else if (e.key === "Enter") {
          focusNextTask(task.id);
          onCheck(task);
        }
      }
    }
  };

  const onDelete = (task: ITaskResponse) => {
    if (task.completed_at) {
      setCompleted(completed.filter((t) => t.id !== task.id));
    } else {
      setIncompleted(incompleted.filter((t) => t.id !== task.id));
    }
    setSelectedTask(null);
    DeleteTask(task.id)
      .then(() => {})
      .catch(() => {
        if (task.completed_at) {
          setCompleted([...completed, task]);
        } else {
          setIncompleted([...incompleted, task]);
        }
      });
  };

  const onCreate = (task: ITaskResponse) => {
    setIsTaskModalVisible(false);
    setIncompleted([...incompleted, task]);
    const element = document.getElementById(`task-${task.id}`);
    if (element) {
      element.focus();
    }
  };

  const onCheck = (task: ITaskResponse) => {
    const dataToUpdate: IUpdateTaskRequest = { title: task.title };
    if (!task.completed_at) {
      dataToUpdate.completed_at = new Date();
      setIncompleted(incompleted.filter((t) => t.id !== task.id));
      setCompleted([...completed, { ...task, completed_at: dataToUpdate.completed_at }]);
    } else {
      setCompleted(completed.filter((t) => t.id !== task.id));
      setIncompleted([...incompleted, { ...task, completed_at: null }]);
    }

    focusNextTask(task.id);
    UpdateTask(task.id, dataToUpdate)
      .then(() => {})
      .catch(() => {
        if (task.completed_at) {
          setCompleted([...completed, task]);
          setIncompleted(incompleted.filter((t) => t.id !== task.id));
        } else {
          setIncompleted([...incompleted, task]);
          setCompleted(completed.filter((t) => t.id !== task.id));
        }
      });
  };

  const onSelect = (task: ITaskResponse) => {
    setSelectedTask(task);
  };

  const onEdit = (task: ITaskResponse) => {
    if (task.completed_at) {
      const index = completed.findIndex((t) => t.id === task.id);
      completed[index] = task;
      setCompleted([...completed]);
    } else {
      const index = incompleted.findIndex((t) => t.id === task.id);
      incompleted[index] = task;
      setIncompleted([...incompleted]);
    }
    setSelectedTask(null);
    focusTask("current", task.id);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTaskModalVisible, selectedTask, completed, incompleted]);

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
      {isExternal && (
        <div className="px-4 py-4 mb-4 text-white import-banner">
          <p className="mb-2">This is an external list, Do you want to import it?</p>
          <button onClick={importSession} className="create-btn py-1 px-3 inline-block">
            Import
          </button>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white font-bold text-xl tracking-widest">{session ? session?.title : "Loading..."}</h1>
        <div className="flex items-center justify-between w-36">
          <RefreshButton />
          <ShareButton />
          <IconButton tabIndex={2} className="keyboard-btn">
            <BsKeyboard />
            <KeyboardDropdown />
          </IconButton>
          <IconButton
            tabIndex={2}
            onClick={() => {
              setIsTaskModalVisible(true);
            }}
          >
            <BsPlusLg />
          </IconButton>
        </div>
      </div>
      <h2 className="text-gray-300 uppercase font-semibold text-sm tracking-widest mb-2">Todo</h2>
      {!session || isLoading ? (
        <div className="text-gray-300 text-sm">Loading...</div>
      ) : (
        incompleted.map((task) => (
          <AnimatePresence key={task.id}>
            <Task onCheck={onCheck} onSelect={onSelect} task={task} />
          </AnimatePresence>
        ))
      )}
      <h2 className="text-gray-300 uppercase font-semibold text-sm tracking-widest mb-2 mt-4">Completed</h2>
      {!session || isLoading ? (
        <div className="text-gray-300 text-sm">Loading...</div>
      ) : (
        completed.map((task) => (
          <AnimatePresence key={task.id}>
            <Task onCheck={onCheck} onSelect={onSelect} task={task} />
          </AnimatePresence>
        ))
      )}
      {selectedTask && (
        <div className="fixed top-32 max-w-md left-1/2 p-4 w-full md:w-1/2 -translate-x-1/2 z-10">
          <TaskModal
            editable={isTaskModalEditable}
            onDelete={onDelete}
            onEdit={onEdit}
            onClose={() => {
              setSelectedTask(null);
            }}
            task={selectedTask}
          />
        </div>
      )}
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
