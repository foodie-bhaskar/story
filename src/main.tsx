import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root.tsx';
import './index.css'
import ErrorPage from "./error-page";
import ViewDropdownPage from './pages/ViewDropdownPage.tsx';
import EditDropdownPage from './pages/EditDropdownPage.tsx';
import DropdownsPage from './pages/DropdownsPage.tsx';
import NewDropdownPage from './pages/NewDropdownPage.tsx';
import NewItemPage from './pages/NewItemPage.tsx';
import NewPackagingPage from './pages/NewPackingPage.tsx';
import Items from './pages/Items.tsx';
import Showcase from './pages/Showcase.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dropdown",
        element: <DropdownsPage />,
      },
      {
        path: "dropdown/:dropdownName",
        element: <ViewDropdownPage />,
      },
      {
        path: "dropdown/edit/:dropdownName",
        element: <EditDropdownPage />,
      },
      {
        path: "dropdown/new",
        element: <NewDropdownPage />,
      },
      {
        path: "asset/item/new",
        element: <NewItemPage />,
      },
      {
        path: "packaging/new",
        element: <NewPackagingPage />,
      },
      {
        path: "list-assets/:assetType",
        element: <Items />,
      },
      {
        path: "showcase",
        element: <Showcase />,
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App title="Foodie UI"/> */}
  </React.StrictMode>,
)
