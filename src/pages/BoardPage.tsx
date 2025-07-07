import Breadcrumbs from '../components/Breadcrumb';
import { RiHome2Line } from 'react-icons/ri';

import BoardDetail from './BoardDetail';


function Dashboard() {
     
    const breadcrumbsItems = [
        { text: 'Home', link: '/', icon: <RiHome2Line /> },
        { text: 'Boards' },
      ];

     

  return (

       <>
      <div className='flex flex-col pt-16 p-4'>
        <Breadcrumbs items={breadcrumbsItems} />
        <hr className="my-2 border-t-1 border-dashed border-gray-300" />
     <BoardDetail/>

    </div>
    </>
  )
}

export default Dashboard