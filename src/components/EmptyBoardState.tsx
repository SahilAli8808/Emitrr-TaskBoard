import React from "react";

interface Props {
  onCreateBoardClick: () => void;
}

const EmptyBoardState: React.FC<Props> = ({ onCreateBoardClick }) => {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6 text-purple-500">📋</div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800">No boards yet</h2>
      <p className="text-gray-600 mb-6">Get started by creating your first task board</p>
      <button
        onClick={onCreateBoardClick}
        className="bg-gray-100 text-gray-800 px-6 py-2 rounded shadow hover:bg-gray-200"
      >
        Create Your First Board
      </button>
    </div>
  );
};

export default EmptyBoardState;