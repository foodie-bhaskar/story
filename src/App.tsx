import { FC, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps, Option, Child, FieldOpts } from './App.type';

// import SeqChoice, { BASE_SEQCHOICE_OPTS } from './core/SeqChoice';
import ShowcaseToggle from './pages/ShowcaseToggle';
import TanQueryShowcase from './pages/TanQueryShowcase';
import ShowcaseDropdownForm from './pages/ShowcaseDropdownForm';
import ShowcaseText from './pages/ShowcaseText';

// Create a client
const queryClient = new QueryClient()

const App: FC<AppProps> = () => {

  
  // const [cascadeOptions, setCascadeOptions] = useState<Option[]>(CASCADE_OPTIONS)

 
  
  return (<QueryClientProvider client={queryClient}>
    <div className="border border-red-400 bg-slate-300 h-max min-h-screen">
      {/* <ShowcaseText /> */}
      {/* <ShowcaseDropdownForm /> */}
      {/* <TanQueryShowcase /> */}
      <ShowcaseToggle />
      {/* 

        <SeqChoice
          label={BASE_SEQCHOICE_OPTS.label}
          type={BASE_SEQCHOICE_OPTS.type} 
          size={BASE_SEQCHOICE_OPTS.size} 
          // step={25}
          selected={BASE_SEQCHOICE_OPTS.selected}
          callback={BASE_SEQCHOICE_OPTS.callback} 
        />
      </div> */}
    </div>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>)
}

export default App
