import { FC, useState } from 'react';
import { AppProps } from './App.type';
import DropdownResource, { BASE_DROPDOWN } from './components/DropdownResource';
import SeqChoice, { BASE_SEQCHOICE_OPTS } from './core/SeqChoice';

const App: FC<AppProps> = () => {

  const [dropdown, setDropdown ] = useState(BASE_DROPDOWN);

  const update = (obj: any) => {
    alert(obj)
  }
  
  return (<div className='p-20 bg-blue-400'>
    <div className="container mx-auto bg-white rounded-lg border border-blue-700">
    <div className="flex flex-row flex-wrap py-4">
      {/* <DropdownResource 
        name={dropdown.name} 
        assetLinked={dropdown.assetLinked} 
        global={dropdown.global} 
        options={dropdown.options}
      /> */}

      <SeqChoice
        label={BASE_SEQCHOICE_OPTS.label}
        type={BASE_SEQCHOICE_OPTS.type} 
        size={BASE_SEQCHOICE_OPTS.size} 
        // step={25}
        selected={BASE_SEQCHOICE_OPTS.selected}
        callback={BASE_SEQCHOICE_OPTS.callback} 
      />
      </div>
      </div>
    </div>
  )
}

export default App
