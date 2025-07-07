import React, { useEffect, useState } from "react";
import { Badge } from "@radix-ui/themes";
import { RiDeleteBin2Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { Plus, Search, Calendar, Filter } from "lucide-react";

// Types
type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

interface Board {
  id: string;
  name: string;
  columns: Column[];
}

const priorityColors: Record<Priority, string> = {
  high: "red",
  medium: "yellow",
  low: "green",
};

// Modal Component
const Modal = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Task Modal Content
const TaskModalContent = ({ title, onSubmit }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    dueDate: "",
  });

  const handleSubmit = () => {
    if (taskData.title.trim()) {
      onSubmit(taskData);
      setTaskData({ title: "", description: "", priority: "medium", dueDate: "" });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={taskData.priority}
            onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as Priority })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            value={taskData.dueDate}
            onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

const BoardDetail: React.FC = () => {
  // Initialize with dynamic sample data
  const [board, setBoard] = useState<Board>({
    id: "1",
    name: "",
    columns: [
      {
        id: "col-1",
        name: "To Do",
        tasks: [
          
        ],
      },
      {
        id: "col-2",
        name: "In Progress",
        tasks: [
  
        ],
      }
    ],
  });

  const [searchQ, setSearchQ] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "">("");
  const [filterDate, setFilterDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalColumnId, setModalColumnId] = useState<string | null>(null);

  const [draggedTask, setDraggedTask] = useState<{
    task: Task;
    sourceColumnId: string;
    taskIndex: number;
  } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverTaskIndex, setDragOverTaskIndex] = useState<number | null>(null);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Filter columns based on search/priorities/dates
  const filteredCols = board.columns.map((col) => {
    const filteredTasks = col.tasks
      .filter((t) =>
        t.title.toLowerCase().includes(searchQ.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQ.toLowerCase())
      )
      .filter((t) => (filterPriority ? t.priority === filterPriority : true))
      .filter((t) => (filterDate ? t.dueDate === filterDate : true));
    return { ...col, tasks: filteredTasks };
  });

  // Column handlers
  const handleCreateColumn = () => {
    const name = prompt("Section name");
    if (name) {
      const newColumn: Column = {
        id: generateId(),
        name,
        tasks: [],
      };
      setBoard(prev => ({
        ...prev,
        columns: [...prev.columns, newColumn],
      }));
    }
  };

  const handleEditColumn = (colId: string, currentName: string) => {
    const newName = prompt("Edit column name", currentName);
    if (newName) {
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.map(col =>
          col.id === colId ? { ...col, name: newName } : col
        ),
      }));
    }
  };

  const deleteColumn = (colId: string) => {
    if (confirm("Are you sure you want to delete this column?")) {
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.filter(col => col.id !== colId),
      }));
    }
  };

  // Task handlers
  const handleOpenTaskModal = (colId: string) => {
    setModalColumnId(colId);
    setShowModal(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, "id">) => {
    if (modalColumnId) {
      const newTask: Task = {
        ...taskData,
        id: generateId(),
      };
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.map(col =>
          col.id === modalColumnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col
        ),
      }));
    }
    setShowModal(false);
    setModalColumnId(null);
  };

  const updateTask = (colId: string, updatedTask: Task) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === colId
          ? {
              ...col,
              tasks: col.tasks.map(t =>
                t.id === updatedTask.id ? updatedTask : t
              ),
            }
          : col
      ),
    }));
  };

  const deleteTask = (colId: string, taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.map(col =>
          col.id === colId
            ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
            : col
        ),
      }));
    }
  };

  // Enhanced drag & drop handlers for task reordering
  const handleDragStart = (
    e: React.DragEvent,
    task: Task,
    colId: string,
    idx: number
  ) => {
    setDraggedTask({ task, sourceColumnId: colId, taskIndex: idx });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, colId: string, taskIndex?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(colId);
    if (taskIndex !== undefined) {
      setDragOverTaskIndex(taskIndex);
    }
  };

  const handleDragEnter = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverColumn(colId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
      setDragOverTaskIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColId: string, targetTaskIndex?: number) => {
    e.preventDefault();
    setDragOverColumn(null);
    setDragOverTaskIndex(null);
    
    if (!draggedTask) return;

    const sourceColId = draggedTask.sourceColumnId;
    const sourceTaskIndex = draggedTask.taskIndex;

    if (sourceColId === targetColId) {
      // Reordering within same column
      if (targetTaskIndex !== undefined && sourceTaskIndex !== targetTaskIndex) {
        setBoard(prev => ({
          ...prev,
          columns: prev.columns.map(col => {
            if (col.id === sourceColId) {
              const newTasks = [...col.tasks];
              const [movedTask] = newTasks.splice(sourceTaskIndex, 1);
              newTasks.splice(targetTaskIndex, 0, movedTask);
              return { ...col, tasks: newTasks };
            }
            return col;
          }),
        }));
      }
    } else {
      // Moving between different columns
      setBoard(prev => ({
        ...prev,
        columns: prev.columns.map(col => {
          if (col.id === sourceColId) {
            return {
              ...col,
              tasks: col.tasks.filter(t => t.id !== draggedTask.task.id),
            };
          }
          if (col.id === targetColId) {
            const newTasks = [...col.tasks];
            const insertIndex = targetTaskIndex !== undefined ? targetTaskIndex : newTasks.length;
            newTasks.splice(insertIndex, 0, draggedTask.task);
            return { ...col, tasks: newTasks };
          }
          return col;
        }),
      }));
    }
    
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
    setDragOverTaskIndex(null);
  };

  return (
    <div className="p-6 m-4 min-h-screen">
      <h1 className="text-xl font-bold mb-6 text-gray-800">{board.name}</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-center flex-wrap bg-white p-4 rounded-lg shadow-sm">
          {/* Filters:  */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="pl-10 pr-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority)}
            className="pl-10 pr-8 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="pl-10 pr-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="ml-auto">
          <button
            onClick={handleCreateColumn}
            className="bg-yellow-400 text-gray-800 px-4 py-1 rounded-md hover:bg-yellow-300 shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {filteredCols.map((col) => (
          <div
            key={col.id}
            className={`bg-white rounded-lg shadow-md w-80 flex-shrink-0 transition-all duration-200 ${
              dragOverColumn === col.id
                ? "bg-blue-50 border-2 border-blue-300 border-dashed"
                : "border border-gray-200"
            }`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragEnter={(e) => handleDragEnter(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg text-gray-800">{col.name}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditColumn(col.id, col.name)}
                  className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                >
                  <BiEdit />
                </button>
                <button
                  onClick={() => deleteColumn(col.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                >
                  <RiDeleteBin2Line />
                </button>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-4 space-y-3 min-h-[200px]">
              {col.tasks.map((task, idx) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, col.id, idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, col.id, idx)}
                  onDrop={(e) => handleDrop(e, col.id, idx)}
                  className={`border-2 p-4 bg-white rounded-lg shadow-sm cursor-move hover:shadow-md hover:scale-105 transition-all duration-200 ${
                    draggedTask?.task.id === task.id
                      ? "opacity-50 rotate-2"
                      : ""
                  } ${
                    dragOverTaskIndex === idx && dragOverColumn === col.id
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200"
                  } hover:border-gray-300 group`}
                  style={{
                    background: dragOverTaskIndex === idx && dragOverColumn === col.id 
                      ? "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5 opacity-30 group-hover:opacity-60 transition-opacity">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                      <strong className="text-gray-800 text-sm font-medium">
                        {task.title}
                      </strong>
                    </div>
                    <div className="flex gap-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newTitle = prompt("Edit Title", task.title);
                          if (newTitle)
                            updateTask(col.id, { ...task, title: newTitle });
                        }}
                        className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        <BiEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(col.id, task.id);
                        }}
                        className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                      >
                        <RiDeleteBin2Line />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <Badge color={priorityColors[task.priority]}>
                      {task.priority}
                    </Badge>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Task Button */}
            <div className="p-4 border-t">
              <button
                onClick={() => handleOpenTaskModal(col.id)}
                className="w-full bg-yellow-400 text-black px-3 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      <Modal open={showModal} onOpenChange={setShowModal}>
        <TaskModalContent title="Add Task" onSubmit={handleTaskSubmit} />
      </Modal>
    </div>
  );
};

export default BoardDetail;