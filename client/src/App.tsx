import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import Task from "./components/Task";
import TaskModal from "./components/TaskModal";
import { ITaskResponse } from "./lib/response";

function App() {
  const [tasks, setTasks] = useState<ITaskResponse[]>([
    {
      id: 1,
      title: "Learn about Polymer",
      created_at: "Mon Apr 26 06:01:55 +0000 2015",
      tags: ["Web Development", "Web Components"],
      is_completed: true,
    },
    {
      id: 2,
      title: "Watch Pluralsight course on Docker",
      created_at: "Tue Mar 02 07:01:55 +0000 2015",
      tags: ["Devops", "Docker"],
      is_completed: true,
    },
    {
      id: 3,
      title: "Complete presentation prep for Aurelia presentation",
      created_at: "Wed Mar 05 10:01:55 +0000 2015",
      tags: ["Presentation", "Aureia"],
      is_completed: false,
    },
    {
      id: 4,
      title: "Instrument creation of development environment with Puppet",
      created_at: "Fri June 30 13:00:00 +0000 2015",
      tags: ["Devops", "Puppet"],
      is_completed: false,
    },
    {
      id: 5,
      title: "Transition code base to ES6",
      created_at: "Mon Aug 01 10:00:00 +0000 2015",
      tags: ["ES6", "Web Development"],
      is_completed: false,
    },
  ]);

  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  useEffect(() => {
    document.onkeydown = (e) => {
      e.key === "c" && setIsTaskModalVisible(true);
      e.key === "Escape" && setIsTaskModalVisible(false);
    };
  }, []);

  return (
    <div className="app max-w-md mx-auto mt-2 sm:mt-6 md:mt-12 p-5 mb-4">
      <AnimatePresence>
        {isTaskModalVisible && (
          <div className="fixed top-32 max-w-md left-1/2 p-4 w-full md:w-1/2 -translate-x-1/2 z-10">
            <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
              <TaskModal
                onClose={() => {
                  setIsTaskModalVisible(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white font-bold text-xl tracking-widest">Task List</h1>
        <div className="flex items-center">
          {/* <button className="text-white mr-4 text-md">
            <BsShare />
          </button> */}
          <button
            onClick={() => {
              setIsTaskModalVisible(true);
            }}
            className="text-white text-md focus:outline-none"
          >
            <BsPlusLg />
          </button>
        </div>
      </div>
      <h2 className="text-gray-300 uppercase font-semibold text-sm tracking-widest mb-2">Todo</h2>
      {tasks.map((todo) => (
        <AnimatePresence>
          {!todo.is_completed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 50 }}>
              <Task
                onCheck={(task: ITaskResponse) => {
                  task.is_completed = true;
                  setTasks([...tasks]);
                }}
                task={todo}
              ></Task>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <h2 className="text-gray-300 uppercase font-semibold text-sm tracking-widest mb-2 mt-4">Completed</h2>
      {tasks.map((todo) => (
        <AnimatePresence>
          {todo.is_completed && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 50 }}>
              <Task
                onCheck={(task: ITaskResponse) => {
                  task.is_completed = false;
                  setTasks([...tasks]);
                }}
                task={todo}
              ></Task>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

export default App;
