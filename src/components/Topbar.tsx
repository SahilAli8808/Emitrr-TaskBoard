import React from "react";
import logo from "../assets/img/logo-emitrr.webp"; // Adjust path as needed

interface TopBarProps {
  open: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ open }) => {
  return (
    <div className='fixed top-0 left-0 right-0 bg-white pt-1 pb-2 shadow'>
      <div className='flex items-center'>
        {/* <PiStudentDuotone className="ml-4 mb-1 mr-2" size={20} /> */}
        <div className={`relative transition-all duration-300 ${open ? "my-2 ml-5" : "my-2 -ml-[130px]"}`}>
          <img src={logo} alt="Emitrr Logo" className="h-6 w-auto object-contain" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
