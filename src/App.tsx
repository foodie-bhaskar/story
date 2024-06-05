import { FC, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps, Option, Child, FieldOpts } from './App.type';

import ShowcaseToggle from './pages/ShowcaseToggle';
import TanQueryShowcase from './pages/TanQueryShowcase';
import ShowcaseDropdownForm from './pages/ShowcaseDropdownForm';
import ShowcaseText from './pages/ShowcaseText';
import ShowcaseCustomOptionForm from './pages/ShowcaseCustomOptionForm';
import ShowcaseToggleComplex from './pages/ShowcaseToggleComplex';

import { Button } from "@/components/ui/button"

// Create a client
const queryClient = new QueryClient()

const App: FC<AppProps> = () => {

  const borderOn = false;
  // const borderOn = true;
  
  return (<QueryClientProvider client={queryClient}>
    <div className="border border-red-400 bg-slate-300 h-max min-h-screen flex flex-row ">
      <aside className="basis-1/6 bg-white">
        <Button>Click me</Button>
      </aside>
      <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} basis-5/6`}>
        {/* <ShowcaseToggleComplex /> */}
        {/* <ShowcaseCustomOptionForm /> */}
        {/* <ShowcaseText /> */}
        <ShowcaseDropdownForm />
        {/* <TanQueryShowcase /> */}
        {/* <ShowcaseToggle />   */}
         {/* 
      </div> */}
      </main>
    </div>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>)
}

export default App
