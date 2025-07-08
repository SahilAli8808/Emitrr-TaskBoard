import React, { useState } from "react";
import Table from "../components/Table/Table";
import EmptyBoardState from "../components/EmptyBoardState";
import { Modal, ModalContent } from "../components/Modal/Modal";
import toast from "react-hot-toast";
import { useBoard } from "../context/BoardContext";
import { RiDeleteBin6Line } from "react-icons/ri";

const BoardView: React.FC = () => {
  const { boards, addBoard, deleteBoard } = useBoard();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleCreateBoard = () => {
    setModalOpen(true);
  };

  const handleSubmit = (data: { name: string; description: string }) => {
    if (!data.name.trim()) {
      toast.error("Board name is required!");
      return;
    }
    addBoard(data.name, data.description);
    toast.success("Board Created Successfully!");
    setFormData({ name: "", description: "" });
    setModalOpen(false);
  };

  const handleDeleteBoard = (id: string) => {
    deleteBoard(id);
    toast.success("Board Deleted Successfully!");
  };

  // Format board data for table, including formatted date and total tasks
  const formattedBoards = boards.map((board: any) => {
    const taskCount = board.columns?.reduce((acc: number, column: any) => 
      acc + (column.tasks?.length || 0), 0) || 0;
    return {
      ...board,
      createdAt: new Date(board.createdAt).toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      totalTasks: `${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}`,
    };
  });

  const headers = [
    { title: "Board Name", accessor: "name" },
    { title: "Description", accessor: "description" },
    { title: "Created At", accessor: "createdAt" },
    { title: "Total Tasks", accessor: "totalTasks" },
  ];

  const actions = [
    {
      label: "Delete",
      onClick: (row: any) => handleDeleteBoard(row.id),
      icon: <RiDeleteBin6Line className="text-red-500" />,
      className: "text-red-500 hover:text-red-700 flex items-center",
    },
  ];

  return (
    <div className="min-h-screen px-6 py-4 bg-white">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-2xl font-bold text-gray-800">Task Boards Details</h4>
          <p className="text-gray-600 text-sm">
            Manage your projects and organize tasks efficiently
          </p>
        </div>
        <button
          onClick={handleCreateBoard}
          className="bg-yellow-400 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-yellow-300 shadow-md"
        >
          + Create New Board
        </button>
      </header>

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent
          title="Create New Board"
          onSubmit={handleSubmit}
        />
      </Modal>

      {boards.length === 0 ? (
        <EmptyBoardState onCreateBoardClick={handleCreateBoard} />
      ) : (
        <Table
          rows={formattedBoards}
          headers={headers}
          actions={actions}
          top={null}
          loading={false}
          rowPath="/boards"
          showPagination={true}
          showSearch={true}
        />
      )}
    </div>
  );
};

export default BoardView;