import React from "react";
import EmptyBoardState from "../components/EmptyBoardState";
import logo from "../assets/img/logo-emitrr.webp";

const BoardView: React.FC = () => {
  const boards = []; // later from context

  const handleCreateBoard = () => {
    console.log("Create board clicked");
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <img
  src={logo}
  alt="Emitrr Logo"
  className="h-12 w-auto object-contain mr-2"
/>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">Task Boards</h1>
            <p className="text-gray-600">Manage your projects and organize tasks efficiently</p>
          </div>
        </div>
        <button
          onClick={handleCreateBoard}
          className="bg-yellow-400 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-200"
        >
          Create New Board
        </button>
      </header>

      {boards.length === 0 ? (
        <EmptyBoardState onCreateBoardClick={handleCreateBoard} />
      ) : (
        <div>/* Will show table later */</div>
      )}
    </div>
  );
};

export default BoardView;
