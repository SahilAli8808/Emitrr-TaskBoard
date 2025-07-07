import Breadcrumbs from '../components/Breadcrumb';
import { RiAlarmWarningLine, RiHome2Line } from 'react-icons/ri';
import DashboardCard from '../components/DashboardCard';
import { FiSettings } from 'react-icons/fi';
import { FaUserAstronaut, FaUserGraduate } from 'react-icons/fa6';


function Dashboard() {



  

 
     
    const breadcrumbsItems = [
        { text: 'Home', link: '/', icon: <RiHome2Line /> },
        { text: 'Dashboard' },
      ];

     


      const dashData = {
        totalAlumnino: 10,
        employedAlumni: 20,
        unemployedAlumni: 30,
        totalIndustries: 30
      }

  return (
    <div>
       <>
      <div className='flex flex-col pt-16 p-4'>
        <Breadcrumbs items={breadcrumbsItems} />
  
        <div className="flex flex-wrap">
          <DashboardCard loading={false} bgColor="#0073B7" icon={<FiSettings  />} value="Total Alumni" additionalField={dashData.totalAlumnino} description="No. of Registered Alumni"  />
          <DashboardCard loading={false} bgColor="#00C0EF" icon={<FaUserAstronaut  />} value="Total Employed " additionalField={dashData.employedAlumni} description="No. of Employed Alumni" />
          <DashboardCard loading={false} bgColor="#F39C12" icon={<FaUserGraduate  />} value="Total Unemployed" additionalField={dashData.unemployedAlumni} description="No. of Unemployed "  />
          <DashboardCard loading={false} bgColor="#00A65A" icon={<RiAlarmWarningLine  />} value="Total Industries" additionalField={dashData.totalIndustries} description="No. of Total Industry"  />
        </div>


     


      <div>

      </div>
      </div>
    </>
    </div>
  )
}

export default Dashboard