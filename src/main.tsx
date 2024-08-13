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
import BrandProducts from './pages/BrandProducts.tsx';
import Product from './pages/Product.tsx';
import ViewAsset from './pages/ViewAsset.tsx';
import EditAsset from './pages/EditAsset.tsx';
import ItemProducts from './pages/ItemProducts.tsx';
import AbstractProducts from './pages/AbstractProducts.tsx';
import AbstractProduct from './pages/AbstractProduct.tsx';

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
        path: "view-asset/:assetType/:assetId",
        element: <ViewAsset />,
      },
      {
        path: "edit-asset/:assetType/:assetId",
        element: <EditAsset />,
      },
      {
        path: "list-assets/:assetType",
        element: <Items />,
      },
      {
        path: "list-assets/brand-products",
        element: <BrandProducts />,
      },
      {
        path: "product/:productId",
        element: <Product />,
      },
      {
        path: "abstract-product/:productId",
        element: <AbstractProduct />,
      },
      {
        path: "product/:productId",
        element: <Product />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "showcase",
        element: <Showcase />,
      },
      {
        path: "item-products",
        element: <ItemProducts />,
      },
      {
        path: "abstract-products",
        element: <AbstractProducts />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App title="Foodie UI"/> */}
  </React.StrictMode>,
)
