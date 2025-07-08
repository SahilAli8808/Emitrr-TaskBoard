import { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumb';
import { RiHome2Line } from 'react-icons/ri';
import DashboardCard from '../components/DashboardCard';
import { GoTasklist } from 'react-icons/go';
import { MdPending } from 'react-icons/md';
import Table from '../components/Table/Table';
import { useBoard } from '../context/BoardContext';
import type { Board, Task } from '../types/board';
import { HiChevronDown } from 'react-icons/hi';

interface TableProps {
  rows: any[];
  headers: { title: string; accessor: string }[];
  loading: boolean;
  showPagination: boolean;
  showSearch: boolean;
  top?: null | React.ReactNode; // Fix: Added top prop
}

function MyTasks() {
  const { board, boards, loadBoard } = useBoard();
  const [selectedUser, setSelectedUser] = useState<string>('All Users');

  // Load a default board if none is selected
  useEffect(() => {
    if (boards.length > 0 && !board) {
      loadBoard(boards[0].id);
    }
  }, [boards, board, loadBoard]);

  // Get unique createdBy users
  const uniqueUsers = Array.from(
    new Set(
      boards.flatMap((b: Board) =>
        (b.columns || []).flatMap((c) => c.tasks.map((t: Task) => t.createdBy))
      )
    )
  ).filter((user): user is string => !!user);

  // Calculate user's tasks
  const userTasks = boards
    .flatMap((b: Board) =>
      (b.columns || []).flatMap((c) =>
        c.tasks
          .filter((t: Task) =>
            selectedUser === 'All Users' ? true : t.createdBy === selectedUser
          )
          .map((t: Task) => ({
            ...t,
            boardName: b.name,
          }))
      )
    );

  // Calculate tasks due soon
  const dueSoonTasks = userTasks.filter((task: any) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 7 && diffDays >= 0;
  });

  const dashData = {
    totalTasks: userTasks.length.toString(), // Fix: Convert to string
    dueSoonTasks: dueSoonTasks.length.toString(), // Fix: Convert to string
  };

  const breadcrumbsItems = [
    { text: 'Home', link: '/', icon: <RiHome2Line /> },
    { text: 'My Tasks' },
  ];

  const headers = [
    { title: 'Task Title', accessor: 'title' },
    { title: 'Description', accessor: 'description' },
    { title: 'Priority', accessor: 'priority' },
    { title: 'Due Date', accessor: 'dueDate' },
    { title: 'Board', accessor: 'boardName' },
  ];

  return (
    <div className="flex flex-col pt-16 p-4">
      <Breadcrumbs items={breadcrumbsItems} />
      <hr className='mb-4 border-dotted'></hr>
<div className="flex justify-between items-center mb-1 px-6">
  <h4 className="text-3xl font-semibold text-gray-800 tracking-tight">📋 Your Tasks</h4>

 <div className="relative flex items-center gap-2 w-80">
      <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
      Filter Tasks by User:
    </label>
    <select
      value={selectedUser}
      onChange={(e) => setSelectedUser(e.target.value)}
      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:bg-gray-100 transition-all duration-200 appearance-none"
    >
      <option value="All Users">All Users</option>
      {uniqueUsers.map((user) => (
        <option key={user} value={user}>
          {user}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-3 top-7 flex items-center pointer-events-none">
      <HiChevronDown className="w-4 h-4 text-gray-400 mb-6" />
    </div>
  </div>
</div>

      <div className="flex flex-wrap m-3">
        <DashboardCard
          loading={false}
          bgColor="#0073B7"
          icon={<GoTasklist />}
          value="My Tasks"
          additionalField={dashData.totalTasks}
          description="No. of Tasks Assigned to You"
        />
        <DashboardCard
          loading={false}
          bgColor="#00A65A"
          icon={<MdPending />}
          value="Due Soon"
          additionalField={dashData.dueSoonTasks}
          description="Tasks Due Within 7 Days"
        />
      </div>
      <div className="px-6 py-4">
        {userTasks.length === 0 ? (
          <p className="text-gray-600">No tasks assigned to {selectedUser === 'All Users' ? 'any user' : selectedUser}.</p>
        ) : (
          <Table
            rows={userTasks}
            headers={headers}
            loading={false}
            showPagination={true}
            showSearch={true}
          />
        )}
      </div>
    </div>
  );
}

export default MyTasks;