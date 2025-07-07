import { Button } from "@radix-ui/themes";
import React from "react";
import { BiRightArrow, BiRightArrowAlt } from "react-icons/bi";

interface Props {
  onCreateBoardClick: () => void;
}

const EmptyBoardState: React.FC<Props> = ({ onCreateBoardClick }) => {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-2 text-purple-500"> <svg className="w-20 h-20 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg></div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800">No boards yet</h2>
      <p className="text-gray-600 mb-6">Get started by creating your first task board</p>
      <Button
       variant="outline"
        onClick={onCreateBoardClick}
        // className="bg-gray-100 text-gray-800 px-6 py-2 rounded shadow hover:bg-gray-200"
      >
        Create Your First Board
        <BiRightArrowAlt/>
      </Button>
     
    </div>
  );
};

export default EmptyBoardState;
