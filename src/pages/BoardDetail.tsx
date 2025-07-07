import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBoard } from "../context/BoardContext";
import type { Column, Task, Priority } from "../types/board";

const priorityColors: Record<Priority, string> = {
  high: "bg-red-200 text-red-800",
  medium: "bg-yellow-200 text-yellow-800",
  low: "bg-green-200 text-green-800",
};

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    board,
    loadBoard,
    addColumn,
    deleteColumn,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
  } = useBoard();

  const [searchQ, setSearchQ] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "">("");
  const [filterDate, setFilterDate] = useState<string>("");

  useEffect(() => {
    if (id) loadBoard(id);
  }, [id]);

  if (!board) return <p>Loading board...</p>;

  const filteredCols = (board.columns ?? []).map((col) => {
    const filteredTasks = col.tasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(searchQ.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQ.toLowerCase())
      )
      .filter((t) => (filterPriority ? t.priority === filterPriority : true))
      .filter((t) => (filterDate ? t.dueDate === filterDate : true));

    return { ...col, tasks: filteredTasks };
  });

  const handleCreateColumn = () => {
    const name = prompt("Column name");
    if (name) addColumn(name);
  };

  const handleAddTask = (col: Column) => {
    const title = prompt("Title");
    const desc = prompt("Description") || "";
    const priority = prompt("Priority (high,medium,low)") as Priority;
    const dueDate = prompt("Due date (YYYY-MM-DD)");
    if (title && priority && dueDate) {
      addTask(col.id, { title, description: desc, priority, dueDate });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{board.name}</h1>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as Priority)}
          className="px-2 py-1 border rounded"
        >
          <option value="">All Priorities</option>
          {["high", "medium", "low"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <button
          onClick={handleCreateColumn}
          className="ml-auto bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Column
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto">
        {filteredCols.map((col) => (
          <div key={col.id} className="bg-white p-3 rounded shadow w-80 flex-shrink-0">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{col.name}</h2>
              <button
                onClick={() => deleteColumn(col.id)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {col.tasks.map((task) => (
                <div key={task.id} className="border p-2 bg-gray-100 rounded">
                  <div className="flex justify-between">
                    <strong>{task.title}</strong>
                    <button
                      onClick={() => deleteTask(col.id, task.id)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs">{task.description}</p>
                  <div className="text-xs flex justify-between mt-1">
                    <span className={`px-1 rounded ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className="italic">{task.dueDate}</span>
                  </div>
                  <button
                    onClick={() => {
                      const newTitle = prompt("Title", task.title);
                      if (newTitle) updateTask(col.id, { ...task, title: newTitle });
                    }}
                    className="text-blue-600 text-xs mt-1"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleAddTask(col)}
              className="mt-3 bg-green-500 text-white px-3 py-1 rounded"
            >
              + Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardDetail;
