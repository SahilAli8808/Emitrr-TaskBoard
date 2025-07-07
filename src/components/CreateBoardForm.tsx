import React, { useState } from "react";
import { useBoardContext } from "../context/BoardContext";

const CreateBoardForm: React.FC = () => {
  const { addBoard } = useBoardContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addBoard({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-gray-50 max-w-md">
      <h2 className="text-xl font-semibold text-gray-800">Create New Board</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Board Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
        />
      </div>
      <button type="submit" className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-300 text-sm shadow">
        + Create Board
      </button>
    </form>
  );
};

export default CreateBoardForm;
