import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@radix-ui/themes/styles.css';
import App from './App.jsx'
import './index.css'

import {createBrowserRouter,  RouterProvider,} from "react-router-dom";
import Dashboard from './pages/Dashboard.js';
import BoardDetail from './pages/BoardDetail.js';
import { BoardProvider } from './context/BoardContext.js';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Dashboard/>,
      },
      { path: "/boards/:id", element: <BoardDetail /> } 
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

