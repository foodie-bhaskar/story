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
      <div className={`${borderOn ? ' border border-red-400': ''} h-max min-h-screen flex flex-row `}>
        <aside  className="basis-1/6  bg-slate-300 max-w-44">
          <nav>
            <ul className={`${borderOn ? 'border border-red-400': ''} ms-2 mt-10 flex flex-col items-start gap-4`}>
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
                  <Link to={`list-assets/rid`}>RIDs</Link>
                </li>
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`list-assets/item`}>Items</Link>
                </li>
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`list-assets/package`}>Packagings</Link>
                </li>
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`list-assets/brand-products`}>Brand Products</Link>
                </li>
                <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                  <Link to={`abstract-products`}>Products</Link>
                </li>
              </>}

              <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                <Link to={`production`}>Production</Link>
              </li>
              <li className="max-w-32 hover:font-medium  text-sm text-blue-700 font-light">
                <h4>Version: {version}</h4>
              </li>
              {/* <li>
                <Link to={`showcase`}>Showcase</Link>
              </li> */}
            </ul>
          </nav>
        </aside>
        <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} w-full  `}>
          <Outlet />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    );
  }