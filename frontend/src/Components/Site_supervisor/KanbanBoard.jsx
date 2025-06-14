import React, { useState } from "react";

const initialTasks = {
  todo: [],
  inProgress: [],
  done: [],
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");

  // Add a new task to the To-Do column
  function addTask() {
    if (!taskName || !taskDate) return alert("Please enter task and date");

    const newTask = {
      id: Date.now(),
      name: taskName,
      date: taskDate,
    };

    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, newTask],
    }));

    setTaskName("");
    setTaskDate("");
  }

  // Move task between columns
  function moveTask(taskId, from, to) {
    setTasks((prev) => {
      const taskToMove = prev[from].find((t) => t.id === taskId);
      if (!taskToMove) return prev;

      return {
        ...prev,
        [from]: prev[from].filter((t) => t.id !== taskId),
        [to]: [...prev[to], taskToMove],
      };
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Your Tasks here</h1>

      {/* Task Input */}
      <div className="max-w-md mx-auto mb-8 p-4 bg-white rounded-2xl shadow">
        <input
          type="text"
          placeholder="Task name"
          className="border p-2 w-full mb-3 rounded"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 w-full mb-3 rounded"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Add Task
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="flex space-x-6 max-w-7xl mx-auto">
        {/* To-Do */}
        <Column
          title="To-Do"
          tasks={tasks.todo}
          onMoveRight={(id) => moveTask(id, "todo", "inProgress")}
          canMoveLeft={false}
          canMoveRight={true}
          color="bg-purple-600"            
          taskBorder="border-purple-600"
          fontColor="text-white"
          backgroundColor="bg-purple-100"
        />

        {/* In Progress */}
        <Column
          title="In Progress"
          tasks={tasks.inProgress}
          onMoveRight={(id) => moveTask(id, "inProgress", "done")}
          onMoveLeft={(id) => moveTask(id, "inProgress", "todo")}
          canMoveLeft={true}
          canMoveRight={true}
          color="bg-yellow-500"            
          taskBorder="border-yellow-600"
          fontColor="text-white"
          backgroundColor="bg-yellow-100"
        />

        {/* Done */}
        <Column
          title="Done"
          tasks={tasks.done}
          onMoveLeft={(id) => moveTask(id, "done", "inProgress")}
          canMoveLeft={true}
          canMoveRight={false}
          color="bg-green-600"            
          taskBorder="border-green-600"
          fontColor="text-white"
          backgroundColor="bg-green-100"
        />
      </div>
    </div>
  );
}

function Column({ title, tasks, onMoveLeft, onMoveRight, canMoveLeft, canMoveRight, color, taskBorder, fontColor, backgroundColor }) {
  return (
    <div className={`flex-1 p-4 rounded-2xl shadow ${backgroundColor}`}>
      <h2 className={`text-xl font-semibold mb-4 ${color} p-4 rounded-2xl w-full ${fontColor} ${backgroundColor}`}>{title}</h2>
      {tasks.length === 0 && <p className="text-gray-500">No tasks</p>}

      <div className="space-y-4">
        {tasks.map(({ id, name, date }) => (
          <div
            key={id}
            className={`p-3 border rounded bg-white flex flex-col space-y-2 ${taskBorder}`}
          >
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-600">Due: {date}</div>
            <div className="flex justify-between">
              {canMoveLeft && (
                <button
                  onClick={() => onMoveLeft(id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  ← Back
                </button>
              )}
              {canMoveRight && (
                <button
                  onClick={() => onMoveRight(id)}
                  className="text-sm text-blue-600 hover:underline ml-auto"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

