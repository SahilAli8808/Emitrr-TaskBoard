import { FaUserCircle, FaLink } from 'react-icons/fa';

interface TaskCardProps {
  title: string;
  subtaskCount: number;
}

export default function TaskCard({ title, subtaskCount }: TaskCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <p className="font-semibold text-lg tracking-wide">{title}</p>

      <div className="flex justify-between items-center mt-5">
        <div className="flex items-center gap-2 text-gray-400">
          <FaUserCircle className="text-xl" />
          <span className="text-sm">Assigned</span>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <span>{subtaskCount}</span>
          <FaLink />
        </div>
      </div>
    </div>
  );
}
