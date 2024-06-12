import { Outlet, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient()

export default function Root() {
  // const borderOn = false;
  const borderOn = true;

    return (<QueryClientProvider client={queryClient}>
      <div className="border border-red-400 h-max min-h-screen flex flex-row ">
        <aside  className="basis-1/6  bg-slate-300 max-w-44">
          <nav>
            <ul>
              <li>
                <Link to={`dropdown`}>Dropdowns</Link>
              </li>
              <li>
                <Link to={`asset/item/new`}>New Item</Link>
              </li>
              <li>
                <Link to={`showcase/seq`}>Sequence Showcase</Link>
              </li>
              <li>
                <Link to={`packaging/new`}>New Package Type</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} w-full bg-white `}>
          <Outlet />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    );
  }