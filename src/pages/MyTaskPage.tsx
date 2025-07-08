import { useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumb';
import { RiHome2Line } from 'react-icons/ri';
import DashboardCard from '../components/DashboardCard';
import { GoTasklist } from 'react-icons/go';
import { MdPending } from 'react-icons/md';
import Table from '../components/Table/Table';
import { useBoard } from '../context/BoardContext';

function MyTasks() {
  const { board, boards, loadBoard } = useBoard();

  // Load a default board if none is selected
  useEffect(() => {
    if (boards.length > 0 && !board) {
      loadBoard(boards[0].id);
    }
  }, [boards, board, loadBoard]);

  // Calculate user's tasks and tasks due soon
  const userTasks = boards.flatMap((b: any) =>
    b.columns?.flatMap((c: any) =>
      c.tasks?.filter((t: any) => t.createdBy === 'Emitrr').map((t: any) => ({
        ...t,
        boardName: b.name,
      })) || []
    ) || []
  );

  const dueSoonTasks = userTasks.filter((task: any) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 7 && diffDays >= 0;
  });

  const dashData = {
    totalTasks: userTasks.length,
    dueSoonTasks: dueSoonTasks.length,
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
        <h4 className="text-2xl font-bold text-gray-800 mb-4">My Tasks</h4>
        {userTasks.length === 0 ? (
          <p className="text-gray-600">No tasks assigned to you.</p>
        ) : (
          <Table
            rows={userTasks}
            headers={headers}
            top={null}
            loading={false}
            rowPath="/tasks"
            showPagination={true}
            showSearch={true}
          />
        )}
      </div>
    </div>
  );
}

export default MyTasks;