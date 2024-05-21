import { FC, useState } from 'react';
import { AppProps, Option, Child, FieldOpts } from './App.type';
// import DropdownResource, { BASE_DROPDOWN } from './components/DropdownResource';
// import SeqChoice, { BASE_SEQCHOICE_OPTS } from './core/SeqChoice';
import ShowcaseToggle from './pages/ShowcaseToggle';

const App: FC<AppProps> = () => {

  // const [dropdown, setDropdown ] = useState(BASE_DROPDOWN);
  // const [cascadeOptions, setCascadeOptions] = useState<Option[]>(CASCADE_OPTIONS)

  const update = (obj: any) => {
    alert(JSON.stringify(obj))
  }
  
  return (
    <div className="container border border-red-400">
      <ShowcaseToggle />
      {/* <div className="flex flex-col py-4 sm:w-3/6">
        <DropdownResource 
          name={dropdown.name} 
          cascadeOptions={dropdown.cascadeOptions} 
          callbackFn={update}
          options={dropdown.options}
        />

        <SeqChoice
          label={BASE_SEQCHOICE_OPTS.label}
          type={BASE_SEQCHOICE_OPTS.type} 
          size={BASE_SEQCHOICE_OPTS.size} 
          // step={25}
          selected={BASE_SEQCHOICE_OPTS.selected}
          callback={BASE_SEQCHOICE_OPTS.callback} 
        />
      </div> */}
    </div>)
}

export default App
