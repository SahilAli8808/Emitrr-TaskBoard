import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@radix-ui/themes/styles.css';
import App from './App.jsx'
import './index.css'

import {createBrowserRouter,  RouterProvider,} from "react-router-dom";
import Dashboard from './pages/Dashboard.js';
import BoardPage from './pages/BoardPage.js';
import { BoardProvider } from './context/BoardContext.js';
import MyTasks from './pages/MyTaskPage.js';
import Settings from './pages/SettingPage.js';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Dashboard/>,
      },
      {
        path: "/mytask",
        element: <MyTasks/>,
      },
      {
        path: "/Setting",
        element: <Settings/>,
      },
      { path: "/boards/:id", element: <BoardPage/> } 
    ]
  },
  
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BoardProvider>
      <RouterProvider router={router} />
    </BoardProvider>
  </StrictMode>,
)

