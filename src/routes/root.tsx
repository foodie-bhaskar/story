import { Outlet, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const version = import.meta.env.VITE_APP_VERSION;
const packetOnly = import.meta.env.VITE_PACKET_ONLY;
const queryClient = new QueryClient()

export default function Root() {
  let borderOn = false;
    // borderOn = true;

    return (<QueryClientProvider client={queryClient}>
      <div className={`${borderOn ? ' border border-blue-400': ''} h-max min-h-screen flex flex-row`}>
        <aside className="min-w-24 bg-slate-300 max-w-44 basis-1/12">
          <nav>
            <ul className={`${borderOn ? 'border border-red-400': ''} ms-2 mt-10 flex flex-col items-start gap-4`}>
              <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                <Link to={`/`}>Home</Link>
              </li>
              {packetOnly === 'false' && <>
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`dropdown`}>Dropdowns</Link>
                </li>
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`item-products`}>Item Products</Link>
                </li>
                <li className="max-w-32 hover:font-medium text-sm text-blue-700 font-light">
                  <Link to={`asset/item/new`}>New Item</Link>
                </li>
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`packaging/new`}>New Package Type</Link>
                </li>
                
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`list-asset/item`}>Items</Link>
                </li>
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`list-asset/package`}>Packagings</Link>
                </li>
                {/* <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`list-assets/brand-products`}>Brand Products</Link>
                </li> */}
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`abstract-products`}>Products</Link>
                </li>
                
                {/* <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={'test/overall'}><h4>Version: {version}</h4></Link>
                </li> */}
              </>}
              <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                <Link to={`list-asset/rid`}>RIDs</Link>
              </li>
              <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                <Link to={`list-asset/store`}>Stores</Link>
              </li>
              <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                <Link to={`inventory/overall`}>Inventory</Link>
              </li>
              <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                <Link to={`production`}>Production</Link>
              </li>
              <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                <Link to={`shipment`}>Shipment</Link>
              </li>
              <li className="max-w-32 text-sm text-blue-700 font-light">
                <h4>Version: {version}</h4>
              </li>
              {/* <li>
                <Link to={`showcase`}>Showcase</Link>
              </li> */}
            </ul>
          </nav>
        </aside>
        <main role="main" className={`${borderOn ? 'border-2 border-yellow-500': ''} basis-11/12`}>
          <Outlet />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    );
  }