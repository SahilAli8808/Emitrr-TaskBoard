import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBoard } from "../context/BoardContext";
import type { Column, Task, Priority } from "../types/board";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

  useEffect(() => {
    if (board && board.columns.length === 0) {
      addColumn("To Do");
    }
  }, [board]);

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
    const name = prompt("Section name");
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

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId !== destination.droppableId ||
      source.index !== destination.index
    ) {
      moveTask(
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
  };

  return (
    <div className="p-6 m-4">
      <h1 className="text-3xl font-bold mb-4">{board.name}</h1>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as Priority)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Priorities</option>
          {["high", "medium", "low"].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <div className="ml-auto">
          
          <button
          onClick={handleCreateColumn}
          className="bg-yellow-400 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-yellow-300 shadow-md"
        >
           + Add Section
        </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {filteredCols.map((col) => (
            <div
              key={col.id}
              className="bg-white p-4 rounded shadow w-80 flex-shrink-0"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">{col.name}</h2>
                <button
                  onClick={() => deleteColumn(col.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>

              <Droppable droppableId={col.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[40px]"
                  >
                    {col.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border p-3 bg-gray-50 rounded shadow"
                          >
                            <div className="flex justify-between items-center">
                              <strong>{task.title}</strong>
                              <button
                                onClick={() => deleteTask(col.id, task.id)}
                                className="text-red-500 text-sm"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="text-sm text-gray-700">{task.description}</p>
                            <div className="text-xs flex justify-between mt-1">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[task.priority]}`}
                              >
                                {task.priority}
                              </span>
                              <span className="italic">{task.dueDate}</span>
                            </div>
                            <button
                              onClick={() => {
                                const newTitle = prompt("Edit Title", task.title);
                                if (newTitle)
                                  updateTask(col.id, { ...task, title: newTitle });
                              }}
                              className="text-blue-600 text-xs mt-1"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                onClick={() => handleAddTask(col)}
                className="mt-4 bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300"
              >
                + Add Task
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default BoardDetail;
