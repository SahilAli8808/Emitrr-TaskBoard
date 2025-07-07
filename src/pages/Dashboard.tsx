import Breadcrumbs from '../components/Breadcrumb';
import { RiAlarmWarningLine, RiHome2Line } from 'react-icons/ri';
import DashboardCard from '../components/DashboardCard';
import { FiSettings } from 'react-icons/fi';
import { FaUserAstronaut, FaUserGraduate } from 'react-icons/fa6';
import EmptyBoardState from '../components/EmptyBoardState';
import BoardView from './BoardView';
import { LiaStackOverflow } from 'react-icons/lia';
import { PiListDashesFill } from 'react-icons/pi';
import { GoTasklist } from 'react-icons/go';
import { MdPending } from 'react-icons/md';


function Dashboard() {
     
    const breadcrumbsItems = [
        { text: 'Home', link: '/', icon: <RiHome2Line /> },
        { text: 'Dashboard' },
      ];

       const dashData = {
        totalboards: 10,
        totaltasks: 20
      }
     

  return (

       <>
      <div className='flex flex-col pt-16 p-4 '>
        <Breadcrumbs items={breadcrumbsItems} />
          <div className="flex flex-wrap m-3">
          <DashboardCard loading={false} bgColor="#0073B7" icon={<PiListDashesFill  />} value="Total Boards" additionalField={dashData.totalboards} description="No. of Available Boards"  />
          {/* <DashboardCard loading={false} bgColor="#00C0EF" icon={<MdPending  />} value="Pending Tasks " additionalField={dashData.totaltasks} description="No. of Pending Tasks" /> */}
          <DashboardCard loading={false} bgColor="#00A65A" icon={<GoTasklist  />} value="Total Tasks" additionalField={dashData.totaltasks} description="No. of Total Tasks"  />
        </div>
         {/* <hr className="my-1 border-t-1 border-dashed border-gray-300" /> */}
     <BoardView/>

    </div>
    </>
  )
}

export default Dashboard