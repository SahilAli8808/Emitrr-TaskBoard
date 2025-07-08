import React, { useEffect, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useBoard } from "../context/BoardContext";
import type { Column, Task, Priority } from "../types/board";
import { RiDeleteBin2Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { Plus, Search, Calendar, Filter } from "lucide-react";
import Modal from "../components/Modal/Modal";
import { TaskModalContent } from "../components/Modal/TaskModal";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';

const priorityColors: Record<Priority, string> = {
  high: "text-red-600",
  medium: "text-yellow-500",
  low: "text-green-600",
};

interface TaskData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

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
    updateColumn,
  } = useBoard();

  const [searchQ, setSearchQ] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "">("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [modalColumnId, setModalColumnId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [editColumnData, setEditColumnData] = useState<Column | null>(null);
  const [editTaskData, setEditTaskData] = useState<{ columnId: string; task: Task } | null>(null);
  
  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<{ task: Task; sourceColumnId: string; taskIndex: number } | null>(null);

  useEffect(() => {
    if (id) loadBoard(id);
  }, [id]);

  useEffect(() => {
    if (board && board.columns.length === 0) {
      addColumn("To Do");
    }
  }, [board]);

  if (!board) return <p>Loading board...</p>;

  const filteredCols = board.columns.map((col) => {
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
    setNewSectionName('');
    setIsSectionModalOpen(true);
  };

  const handleSectionSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newSectionName.trim()) {
      addColumn(newSectionName);
      setIsSectionModalOpen(false);
    }
  };

  const handleAddTask = (col: Column) => {
    setModalColumnId(col.id);
    setIsTaskModalOpen(true);
  };

  const handleEditColumn = (column: Column) => {
    setEditColumnData(column);
  };

  const handleEditTask = (columnId: string, task: Task) => {
    setEditTaskData({ columnId, task });
  };

  const handleTaskSubmit = (data: TaskData) => {
    if (modalColumnId) {
      addTask(modalColumnId, data);
      setIsTaskModalOpen(false);
    }
  };

  const handleSectionEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editColumnData && updateColumn) {
      updateColumn(editColumnData.id, editColumnData.name);
      setEditColumnData(null);
    }
  };

  const handleTaskEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editTaskData) {
      updateTask(editTaskData.columnId, editTaskData.task);
      setEditTaskData(null);
    }
  };

  // Drag and drop handlers
  const handleTaskDragStart = (e: React.DragEvent, task: Task, sourceColumnId: string, taskIndex: number) => {
    setDraggedTask({ task, sourceColumnId, taskIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleColumnDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleColumnDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if we're leaving the column container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (draggedTask) {
      const targetColumn = board.columns.find(col => col.id === targetColumnId);
      if (targetColumn) {
        const targetIndex = targetColumn.tasks.length;
        moveTask(
          draggedTask.sourceColumnId,
          targetColumnId,
          draggedTask.taskIndex,
          targetIndex
        );
      }
    }
    setDragOverColumn(null);
  };

  return (
    <div className="p-6 m-4 min-h-screen">
      <h1 className="text-xl font-bold mb-6 text-gray-800">{board.name}</h1>

      <div className="flex gap-4 mb-6 items-center flex-wrap bg-white p-4 rounded-lg shadow-sm">
        {/* Search */}
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

        {/* Priority Filter */}
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

        {/* Date Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="pl-10 pr-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Column */}
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

      <div className="flex gap-4 overflow-x-auto pb-4">
        {filteredCols.map((col) => (
          <div
            key={col.id}
            className={`bg-white rounded-lg shadow-md w-80 flex-shrink-0 transition-all duration-200 ${
              dragOverColumn === col.id
                ? "bg-blue-50 border-2 border-blue-300 border-dashed"
                : "border border-gray-200"
            }`}
            onDragOver={(e) => handleColumnDragOver(e, col.id)}
            onDragEnter={(e) => handleColumnDragEnter(e, col.id)}
            onDragLeave={handleColumnDragLeave}
            onDrop={(e) => handleColumnDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-lg text-gray-800">{col.name}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditColumn(col)}
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

            {/* Task List */}
            <div className="p-4 space-y-3 min-h-[200px]">
              {col.tasks.map((task, idx) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleTaskDragStart(e, task, col.id, idx)}
                  onDragEnd={handleTaskDragEnd}
                  className={`border-2 p-4 bg-white rounded-lg shadow-sm cursor-move hover:shadow-md hover:scale-105 transition-all duration-200 ${
                    draggedTask?.task.id === task.id ? "opacity-50 rotate-2" : ""
                  } ${
                    dragOverColumn === col.id
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200"
                  } hover:border-gray-300 group`}
                  style={{
                    background:
                      dragOverColumn === col.id
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
                          handleEditTask(col.id, task);
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
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-medium ${priorityColors[task.priority]}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    {task.dueDate && (
                      <span className="text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Task */}
            <div className="p-4 border-t">
              <button
                onClick={() => handleAddTask(col)}
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
      <Modal open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <TaskModalContent title="Add Task" onSubmit={handleTaskSubmit} />
      </Modal>

      {/* Add Section Modal */}
      <Modal open={isSectionModalOpen} onOpenChange={setIsSectionModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold">Add Section</Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-gray-500">
                <Cross1Icon />
              </Dialog.Close>
            </div>
            <form onSubmit={handleSectionSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Section Name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 text-black py-2 rounded-md hover:bg-yellow-500 transition font-medium"
              >
                Add Section
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Modal>

      {/* Edit Section Modal */}
      <Modal open={!!editColumnData} onOpenChange={() => setEditColumnData(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold">Edit Section</Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-gray-500">
                <Cross1Icon />
              </Dialog.Close>
            </div>
            <form onSubmit={handleSectionEditSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Section Name"
                value={editColumnData?.name || ''}
                onChange={(e) =>
                  setEditColumnData(prev => prev ? { ...prev, name: e.target.value } : null)
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditColumnData(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Modal>

      {/* Edit Task Modal */}
      <Modal open={!!editTaskData} onOpenChange={() => setEditTaskData(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold">Edit Task</Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-gray-500">
                <Cross1Icon />
              </Dialog.Close>
            </div>
            <form onSubmit={handleTaskEditSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Task Title"
                value={editTaskData?.task.title || ''}
                onChange={(e) =>
                  setEditTaskData(prev => prev ? {
                    ...prev,
                    task: { ...prev.task, title: e.target.value }
                  } : null)
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Task Description"
                value={editTaskData?.task.description || ''}
                onChange={(e) =>
                  setEditTaskData(prev => prev ? {
                    ...prev,
                    task: { ...prev.task, description: e.target.value }
                  } : null)
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                required
              />
              <select
                value={editTaskData?.task.priority || 'medium'}
                onChange={(e) =>
                  setEditTaskData(prev => prev ? {
                    ...prev,
                    task: { ...prev.task, priority: e.target.value as Priority }
                  } : null)
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                value={editTaskData?.task.dueDate || ''}
                onChange={(e) =>
                  setEditTaskData(prev => prev ? {
                    ...prev,
                    task: { ...prev.task, dueDate: e.target.value }
                  } : null)
                }
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditTaskData(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Modal>
    </div>
  );
};

export default BoardDetail;