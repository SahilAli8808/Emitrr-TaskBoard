import { FaUserCircle, FaLink } from 'react-icons/fa';

interface TaskCardProps {
  title: string;
  subtaskCount: number;
}

export default function TaskCard({ title, subtaskCount }: TaskCardProps) {
  return (
    <div className="bg-[#1e1e1e] rounded-md p-4 text-white shadow-md mb-4">
      <p className="font-semibold text-sm">{title}</p>
      <div className="flex justify-between items-center mt-4">
        <FaUserCircle className="text-gray-400 text-lg" />
        <span className="text-xs text-gray-400 flex items-center">
          {subtaskCount} <FaLink className="ml-1" />
        </span>
      </div>
    </div>
  );
}
