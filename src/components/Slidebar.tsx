import { useState, useEffect } from 'react';
import { RxDashboard, RxHamburgerMenu } from "react-icons/rx";
import { FaStreetView } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import TopBar from './Topbar';
import { FiSettings } from 'react-icons/fi';
import { BiTask } from 'react-icons/bi';

interface MenuItem {
  title: string;
  path: string;
  icon: any;
}

interface MenuListProps {
  list: MenuItem[];
  listTitle: string;
}

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const isAuthorized = true;

  // Hook to detect screen width
  const useMediaQuery = (width: number): boolean => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setOpen(false);
      } else {
        setOpen(true);
      }
      setTargetReached(e.matches);
    };

    useEffect(() => {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      media.addEventListener('change', updateTarget);

      if (media.matches) {
        setOpen(false);
      }

      return () => media.removeEventListener('change', updateTarget);
    }, [width]);

    return targetReached;
  };

  const isMobile = useMediaQuery(768);

  const NavMenu: MenuItem[] = [
    { title: "Dashboard", path: '/', icon: <RxDashboard /> },
    { title: "My Tasks", path: '/mytask', icon: <BiTask/> },
    { title: "Settings", path: '/Setting', icon: <FiSettings /> },
  ];

  const MastersMenu: MenuItem[] = [
    { title: "General Settings", path: '/profile', icon: <FaStreetView /> }
  ];

  const MenuList: React.FC<MenuListProps> = ({ list, listTitle }) => (
    <div className='flex flex-col mb-3 mt-2'>
      <div className={`flex text-xs p-2 text-slate-500 -ml-2 ${!open && 'text-white hover:cursor-default'}`}>{listTitle}</div>
      {list.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          className={({ isActive }) =>
            `flex hover:text-slate-900 hover:cursor-pointer hover:bg-sky-100 pb-2 pt-1.5 rounded ${open ? 'max-w-[180px]' : 'max-w-[32px]'} ` +
            (isActive ? 'text-slate-900 bg-slate-300' : 'text-slate-700')
          }
        >
          <div className='mt-1 duration-500 px-2'>
            {item.icon}
          </div>
          <div className={`text-nowrap text-sm font-medium ${!open && 'hidden'} duration-500`}>
            {item.title}
          </div>
        </NavLink>
      ))}
    </div>
  );

  return (
    <>
      <div className={`bg-foreground-blue border h-screen pl-5 pt-12 ${open ? "w-56" : "w-[80px]"} duration-500 sticky top-0 float-left`}>
        <TopBar open={open} />
        <RxHamburgerMenu
          className={`hover:cursor-pointer w-7 h-6 rounded-full fixed mb-2 top-4 ${open ? "left-[190px]" : "left-[90px]"} duration-300`}
          onClick={() => setOpen(prev => !prev)}
        />
        <MenuList list={NavMenu} listTitle={'Navigation'} />
        {isAuthorized && <MenuList list={MastersMenu} listTitle={'Settings'} />}
      </div>
    </>
  );
};

export default Sidebar;
