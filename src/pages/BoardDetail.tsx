import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBoard } from "../context/BoardContext";
import type { Column, Task, Priority } from "../types/board";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RiDeleteBin2Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { Plus, Search, Calendar, Filter } from "lucide-react";
import Modal from "../components/Modal/Modal";
import { TaskModalContent } from "../components/Modal/TaskModal";

const priorityColors: Record<Priority, string> = {
  high: "text-red-600",
  medium: "text-yellow-500",
  low: "text-green-600",
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
  const [showModal, setShowModal] = useState(false);
  const [modalColumnId, setModalColumnId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

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

  const handleEditColumn = (id: string, currentName: string) => {
    const newName = prompt("Edit section name", currentName);
    if (newName) {
      // Assuming updateColumn function exists in context
      // updateColumn(id, newName);
      alert("Edit column not implemented"); // fallback
    }
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = () => {
    setDragOverColumn(null);
  };

  const handleTaskSubmit = () => {
    // Placeholder if you plan to use modal
    setShowModal(false);
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

      <DragDropContext onDragEnd={onDragEnd}>
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
              onDrop={(e) => handleDrop(e)}
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

              {/* Task List */}
             <Droppable droppableId={col.id}>
  {(provided) => (
    <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="p-4 space-y-3 min-h-[200px]"
    >
      {col.tasks.map((task, idx) => (
        <Draggable draggableId={task.id} index={idx} key={task.id}>
          {(providedDrag, snapshot) => (
            <div
              ref={providedDrag.innerRef}
              {...providedDrag.draggableProps}
              {...providedDrag.dragHandleProps}
              className={`border-2 p-4 bg-white rounded-lg shadow-sm cursor-move hover:shadow-md hover:scale-105 transition-all duration-200 ${
                snapshot.isDragging ? "opacity-50 rotate-2" : ""
              } ${
                dragOverColumn === col.id && snapshot.draggingOver === col.id
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200"
              } hover:border-gray-300 group`}
              style={{
                background:
                  dragOverColumn === col.id && snapshot.draggingOver === col.id
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
                      if (newTitle) updateTask(col.id, { ...task, title: newTitle });
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
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>
  )}
</Droppable>


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
      </DragDropContext>

      {/* Task Modal */}
      <Modal open={showModal} onOpenChange={setShowModal}>
        <TaskModalContent title="Add Task" onSubmit={handleTaskSubmit} />
      </Modal>
    </div>
  );
};

export default BoardDetail;
