import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumb';
import { RiHome2Line } from 'react-icons/ri';
import toast from 'react-hot-toast';

function Settings() {
  const breadcrumbsItems = [
    { text: 'Home', link: '/', icon: <RiHome2Line /> },
    { text: 'Settings' },
  ];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.name && storedUser.email) {
      setName(storedUser.name);
      setEmail(storedUser.email);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    const user = { name, email };
    localStorage.setItem('user', JSON.stringify(user));
    toast.success("User Details Saved Successfully!")
    setIsSaved(true);
  };

  return (
    <div className="flex flex-col pt-16 p-4">
      <Breadcrumbs items={breadcrumbsItems} />
      <div className="px-6 py-4">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 py-1 pl-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter your name"
                disabled={isSaved}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="my-2  py-1 pl-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter your email"
                disabled={isSaved}
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleSave}
                className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-yellow-300 shadow-md"
                disabled={isSaved || !name || !email}
              >
                Save Changes
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm text-gray-500">
            Save your name and email. Once saved, the fields will be disabled.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
