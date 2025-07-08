import React, { useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumb'; 
import { RiHome2Line } from 'react-icons/ri';
import DashboardCard from '../components/DashboardCard';
import { PiListDashesFill } from 'react-icons/pi';
import { GoTasklist } from 'react-icons/go';
import BoardView from './BoardView';
import { useBoard } from '../context/BoardContext';

function Dashboard() {
  const { board, boards, loadBoard } = useBoard();
  
  // Load a default board if none is selected
  useEffect(() => {
    if (boards.length > 0 && !board) {
      loadBoard(boards[0].id);
    }
  }, [boards, board, loadBoard]);

  // Calculate total boards and tasks from context
  const dashData = {
    totalboards: boards.length,
    totaltasks: boards.reduce((acc: number, board: any) => {
      return acc + (board.columns?.reduce((colAcc: number, column: any) => 
        colAcc + (column.tasks?.length || 0), 0) || 0);
    }, 0)
  };

  const breadcrumbsItems = [
    { text: 'Home', link: '/', icon: <RiHome2Line /> },
    { text: 'Dashboard' },
  ];

  return (
    <div className='flex flex-col pt-16 p-4'>
      <Breadcrumbs items={breadcrumbsItems} />
      <div className="flex flex-wrap m-3">
        <DashboardCard 
          loading={false} 
          bgColor="#0073B7" 
          icon={<PiListDashesFill />} 
          value="Total Boards" 
          additionalField={dashData.totalboards} 
          description="No. of Available Boards"  
        />
        <DashboardCard 
          loading={false} 
          bgColor="#00A65A" 
          icon={<GoTasklist />} 
          value="Total Tasks" 
          additionalField={dashData.totaltasks} 
          description="No. of Total Tasks"  
        />
      </div>
      <BoardView />
    </div>
  );
}

export default Dashboard;