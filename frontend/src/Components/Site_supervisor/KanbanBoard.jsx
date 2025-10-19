import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE = "http://localhost:8086/api/v1/site_supervisor";


const initialTasks = {
  todo: [],
  inProgress: [],
  done: [],
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");

  const { employeeId } = useParams();

  // Fetch tasks from backend on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE}/todo/sp/${employeeId}`)
      .then((res) => {
        const allTasks = Array.isArray(res.data) ? res.data : [res.data];
        const newTasks = { todo: [], inProgress: [], done: [] };

        allTasks.forEach((task) => {
          const formattedTask = {
            id: task.task_id,
            name: task.description,
            date: task.date,
          };

          console.log("Fetched task:", formattedTask);
          const status = (task.status || "").toLowerCase();
          if (status === "pending" || status === "todo") {
            newTasks.todo.push(formattedTask);
          } else if (status === "in_progress") {
            newTasks.inProgress.push(formattedTask);
          } else if (status === "completed") {
            newTasks.done.push(formattedTask);
          } else {
            // If unknown status, default to todo
            newTasks.todo.push(formattedTask);
          }
        });

        setTasks(newTasks);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      });
  }, []);

  // Add new task to backend and state
  function addTask() {
    if (!taskName || !taskDate) return alert("Please enter task and date");

    const newTaskPayload = {
      employee_id: employeeId,
      status: "pending",
      description: taskName,
      date: taskDate,
    };

    axios
      .post(`${API_BASE}/to_do`, newTaskPayload)
      .then((res) => {
        const addedTask = {
          id: res.data.task_id,
          name: res.data.description,
          date: res.data.date,
        };

        setTasks((prev) => ({
          ...prev,
          todo: [...prev.todo, addedTask],
        }));

        setTaskName("");
        setTaskDate("");
      })
      .catch((err) => {
        console.error("Error adding task:", err);
      });
  }

  // Move task between columns and update backend status
  function moveTask(taskId, from, to) {
    const statusMap = {
      todo: "pending",
      inProgress: "in_progress",
      done: "completed",
    };

    const taskToMove = tasks[from].find((t) => t.id === taskId);
    if (!taskToMove) return;

    const updatePayload = {
      task_id: taskToMove.id,
      employee_id: employeeId,
      status: statusMap[to],
      description: taskToMove.name,
      date: taskToMove.date,
    };

    axios
      .put(`${API_BASE}/todo/update`, updatePayload)
      .then(() => {
        setTasks((prev) => ({
          ...prev,
          [from]: prev[from].filter((t) => t.id !== taskId),
          [to]: [...prev[to], taskToMove],
        }));
      })
      .catch((err) => {
        console.error("Error updating task status:", err);
      });
  }

  // Delete task from backend and state
  function deleteTask(taskId, from) {
    // Optional: log the tasks in that column
    console.log(tasks[from]);

    axios
      .delete(`${API_BASE}/todo/${taskId}`) // <-- use taskId, not task.id
      .then(() => {
        setTasks((prev) => ({
          ...prev,
          [from]: prev[from].filter((t) => t.task_id !== taskId),
        }));
      })
      .catch((err) => {
        console.error("Error deleting task:", err);
      });
  }


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Your Tasks</h1>

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
          columnKey="todo"
          onMoveRight={(id) => moveTask(id, "todo", "inProgress")}
          onDelete={(id) => deleteTask(id, "todo")}
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
          columnKey="inProgress"
          onMoveRight={(id) => moveTask(id, "inProgress", "done")}
          onMoveLeft={(id) => moveTask(id, "inProgress", "todo")}
          onDelete={(id) => deleteTask(id, "inProgress")}
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
          columnKey="done"
          onMoveLeft={(id) => moveTask(id, "done", "inProgress")}
          onDelete={(id) => deleteTask(id, "done")}
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

function Column({
  title,
  tasks,
  columnKey,
  onMoveLeft,
  onMoveRight,
  onDelete,
  canMoveLeft,
  canMoveRight,
  color,
  taskBorder,
  fontColor,
  backgroundColor,
}) {
  return (
    <div className={`flex-1 p-4 rounded-2xl shadow ${backgroundColor}`}>
      <h2
        className={`text-xl font-semibold mb-4 ${color} p-4 rounded-2xl w-full ${fontColor} ${backgroundColor}`}
      >
        {title}
      </h2>
      {tasks.length === 0 && <p className="text-gray-500">No tasks</p>}

      <div className="space-y-4">
        {tasks.map(({ id, name, date }) => (
          <div
            key={id}
            className={`p-3 border rounded bg-white flex flex-col space-y-2 ${taskBorder}`}
          >
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-600">Due: {date}</div>
            <div className="flex justify-between items-center">
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
              <button
                onClick={() => onDelete(id)}
                className="text-sm text-red-600 hover:underline ml-4"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
