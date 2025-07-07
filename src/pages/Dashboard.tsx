import Breadcrumbs from '../components/Breadcrumb';
import { RiAlarmWarningLine, RiHome2Line } from 'react-icons/ri';
import DashboardCard from '../components/DashboardCard';
import { FiSettings } from 'react-icons/fi';
import { FaUserAstronaut, FaUserGraduate } from 'react-icons/fa6';
import EmptyBoardState from '../components/EmptyBoardState';
import BoardView from './BoardView';


function Dashboard() {
     
    const breadcrumbsItems = [
        { text: 'Home', link: '/', icon: <RiHome2Line /> },
        { text: 'Dashboard' },
      ];

     

  return (

       <>
      <div className='flex flex-col pt-16 p-4'>
        <Breadcrumbs items={breadcrumbsItems} />
         <hr className="my-1 border-t-1 border-dashed border-gray-300" />
     <BoardView/>

    </div>
    </>
  )
}

export default Dashboard