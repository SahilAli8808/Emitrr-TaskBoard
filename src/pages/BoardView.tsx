import React, { useEffect, useState } from "react";
import Table from "../components/Table/Table";
import EmptyBoardState from "../components/EmptyBoardState";
import { Modal, ModalContent } from '../components/Modal/Modal';
import toast from "react-hot-toast";

interface Board {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const BoardView: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    const storedBoards = localStorage.getItem("boards");
    if (storedBoards) {
      setBoards(JSON.parse(storedBoards));
    }
    // toast.success("hi")
  }, []);

  const handleCreateBoard = () => {
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBoard: Board = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      createdAt: new Date().toLocaleString(),
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    localStorage.setItem("boards", JSON.stringify(updatedBoards));
    toast.success("Board Created Successfully!")
    
    setFormData({ name: "", description: "" });
    setModalOpen(false);
  };

  const headers = [
    { title: "Board Name", accessor: "name" },
    { title: "Description", accessor: "description" },
    { title: "Created At", accessor: "createdAt" },
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
    onSubmit={(data) => {
      const newBoard = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        createdAt: new Date().toLocaleString(),
      };
      const updatedBoards = [...boards, newBoard];

      setBoards(updatedBoards);
      localStorage.setItem("boards", JSON.stringify(updatedBoards));
      toast.success("Board Created Successfully!")
      setFormData({ name: "", description: "" });
      setModalOpen(false);
    }}
  />
</Modal>


      {boards.length === 0 ? (
        <EmptyBoardState onCreateBoardClick={handleCreateBoard} />
      ) : (
        <Table
          rows={boards}
          headers={headers}
          top={null}
          loading={loading}
          rowPath={"/boards"}
          showPagination={true}
          showSearch={true}
        />
      )}
    </div>
  );
};

export default BoardView;
