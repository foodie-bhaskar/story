import { FC, useState } from 'react';
import { AppProps } from './App.type';
import DropdownResource, { BASE_DROPDOWN } from './components/DropdownResource';

const App: FC<AppProps> = () => {

  const [dropdown, setDropdown ] = useState(BASE_DROPDOWN);

  const update = (obj: any) => {
    alert(obj)
  }
  
  return (<div className='p-20 bg-blue-400'>
      <DropdownResource 
        name={dropdown.name} 
        assetLinked={dropdown.assetLinked} 
        global={dropdown.global} 
        options={dropdown.options}
      />
    </div>
  )
}

export default App
