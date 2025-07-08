import React, { useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumb';
import { RiHome2Line } from 'react-icons/ri';
import DashboardCard from '../components/DashboardCard';
import { FiSettings } from 'react-icons/fi';
import { useBoard } from '../context/BoardContext';

function Settings() {
  const { board, boards, loadBoard } = useBoard();

  // Load a default board if none is selected
  useEffect(() => {
    if (boards.length > 0 && !board) {
      loadBoard(boards[0].id);
    }
  }, [boards, board, loadBoard]);

  // Calculate number of boards created by user
  const dashData = {
    userBoards: boards.filter((b: any) =>
      b.columns?.some((c: any) => c.tasks?.some((t: any) => t.createdBy === 'Emitrr')) || false
    ).length,
  };

  const breadcrumbsItems = [
    { text: 'Home', link: '/', icon: <RiHome2Line /> },
    { text: 'Settings' },
  ];

  return (
    <div className="flex flex-col pt-16 p-4">
      <Breadcrumbs items={breadcrumbsItems} />
      <div className="flex flex-wrap m-3">
        <DashboardCard
          loading={false}
          bgColor="#0073B7"
          icon={<FiSettings />}
          value="Your Boards"
          additionalField={dashData.userBoards}
          description="No. of Boards with Your Tasks"
        />
      </div>
      <div className="px-6 py-4">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">Settings</h4>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h5 className="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h5>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter your name"
                disabled
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter your email"
                disabled
              />
            </div>
            <div>
              <button
                type="button"
                className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-yellow-300 shadow-md"
                disabled
              >
                Save Changes
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm text-gray-500">
            Settings are currently disabled. Contact support to update your profile.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;