import React, { useEffect, useState } from "react";
import Table from "../components/Table/Table"; // Assuming Table is the custom table
import EmptyBoardState from "../components/EmptyBoardState";

interface Board {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const BoardView: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedBoards = localStorage.getItem("boards");
    if (storedBoards) {
      setBoards(JSON.parse(storedBoards));
    }
  }, []);

  const handleCreateBoard = () => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name: `Board ${boards.length + 1}`,
      description: "This is a new board",
      createdAt: new Date().toISOString(),
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    localStorage.setItem("boards", JSON.stringify(updatedBoards));
  };

  const headers = [
    { title: "Board Name", accessor: "name" },
    { title: "Description", accessor: "description" },
    { title: "Created At", accessor: "createdAt" },
  ];

  return (
    <div className="min-h-screen px-6 py-8 bg-white">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Boards</h1>
          <p className="text-gray-600 text-sm">Manage your projects and organize tasks efficiently</p>
        </div>
        <button
          onClick={handleCreateBoard}
          className="bg-yellow-400 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-yellow-300 shadow-md"
        >
          + Create New Board
        </button>
      </header>

      {boards.length === 0 ? (
        <EmptyBoardState onCreateBoardClick={handleCreateBoard} />
      ) : (
        <Table
          rows={boards}
          headers={headers}
          top={null}
          loading={loading}
          rowPath={"/boards"} // optional, if you want clickable board name
          showPagination={true}
          showSearch={true}
        />
      )}
    </div>
  );
};

export default BoardView;
