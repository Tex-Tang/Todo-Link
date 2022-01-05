import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsKeyboard, BsPlusLg } from "react-icons/bs";
import AddTaskModal from "./components/AddTaskModal";
import Task from "./components/Task";
import TaskModal from "./components/TaskModal";
import { ITaskResponse } from "./lib/response";

function App() {
  const [data, setData] = useState<ITaskResponse[]>([
    {
      id: 1,
      title: "Learn about Polymer",
      is_completed: true,
    },
    {
      id: 2,
      title: "Watch Pluralsight course on Docker",
      is_completed: true,
    },
    {
      id: 3,
      title: "Complete presentation prep for Aurelia presentation",
      is_completed: false,
    },
    {
      id: 4,
      title: "Instrument creation of development environment with Puppet",
      is_completed: false,
    },
    {
      id: 5,
      title: "Transition code base to ES6",
      is_completed: false,
    },
  ]);

  const focusTask = (dir: string, id: string) => {
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
        (elements[index - 1] as HTMLDivElement).focus();
      } else if (dir === "next" && elements[index + 1]) {
        (elements[index + 1] as HTMLDivElement).focus();
      } else {
        currentElement.focus();
      }
    }
  };

  const [selectedTask, setSelectedTask] = useState<ITaskResponse | null>(null);

  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "c" && selectedTask === null) {
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
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTaskModalVisible, selectedTask]);

  const onDelete = (task: ITaskResponse) => {
    task.hidden = true;
    setData([...data]);
    focusTask("next", task.id.toString());
    setSelectedTask(null);
  };

  return (
    <div className="app max-w-md mx-auto mt-2 sm:mt-6 md:mt-12 p-5 mb-4">
      <AnimatePresence>
        {isTaskModalVisible && (
          <div className="fixed top-32 max-w-md left-1/2 p-4 w-full md:w-1/2 -translate-x-1/2 z-10">
            <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
              <AddTaskModal
                onCreate={(task) => {
                  setData([...data, task]);
                  setIsTaskModalVisible(false);

                  // Trick to wait for new task to be added to DOM
                  setTimeout(() => {
                    focusTask("current", task.id.toString());
                  }, 100);
                }}
                onClose={() => {
                  setIsTaskModalVisible(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white font-bold text-xl tracking-widest">Tasks List</h1>
        <div className="flex items-center">
          {/* <button className="text-white mr-4 text-md">
            <BsShare />
          </button> */}
          <button className="keyboard-btn relative text-white text-xl p-1 focus:outline-none border border-transparent focus:border-white rounded-md">
            <BsKeyboard />
            <div className="shortcuts-container p-2 absolute bot-0 -right-9 w-64 z-20 hidden">
              <div className="task-modal text-left w-full p-2 py-3 text-sm rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">c</span> Create task
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">&#x232b;</span> Delete task
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">&uarr;</span> Previous task
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">&darr;</span> Next task
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">e</span> Edit
                </div>
                <div className="flex items-center mb-2">
                  <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">Esc</span> Back
                </div>
                <div className="flex items-center">
                  <span className="font-mono px-2 py-0.5 bg-gray-800 create-btn mr-1">Tab</span> Navigate around
                </div>
              </div>
            </div>
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
      {data.map((task) => (
        <AnimatePresence>
          {!task.is_completed && !task.hidden && (
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Task
                onDelete={onDelete}
                onClick={(task: ITaskResponse) => {
                  setSelectedTask(task);
                }}
                onCheck={(task: ITaskResponse) => {
                  task.is_completed = true;
                  setData([...data]);
                }}
                task={task}
              ></Task>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <h2 className="text-gray-300 uppercase font-semibold text-sm tracking-widest mb-2 mt-4">Completed</h2>
      {data.map((task) => (
        <AnimatePresence>
          {task.is_completed && !task.hidden && (
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Task
                onDelete={onDelete}
                onClick={(task: ITaskResponse) => {
                  setSelectedTask(task);
                }}
                onCheck={(task: ITaskResponse) => {
                  task.is_completed = false;
                  setData([...data]);
                }}
                task={task}
              ></Task>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <div className="fixed top-32 max-w-md left-1/2 p-4 w-full md:w-1/2 -translate-x-1/2 z-10">
        {selectedTask && (
          <TaskModal
            onDelete={onDelete}
            onEdit={(task) => {
              setData([...data]);
              focusTask("current", selectedTask.id.toString());
              setSelectedTask(null);
            }}
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
