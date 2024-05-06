import { FC, useState } from 'react';
import { AppProps, Option } from './App.type';
import CustomList from './core/CustomList';

const App: FC<AppProps> = ({ title }) => {
  let sample = [ { name: 'Karnataka', value: 'KA' }, { name: 'Andhra Pradesh', value: 'AP' }];

  let categories = [
    { name: 'Gravy', value: 'Gravy' },
    { name: 'Bread', value: 'Bread' },
    { name: 'Rice', value: 'Rice' }
  ]
  // const [options, setOptions] = useState<Option[]>(sample);
  const [options] = useState<Option[]>(categories);

  // setOptions();

  return (<>
    <h1 className="text-3xl font-bold underline">
      Hello world! {title}
    </h1>
    <CustomList options={options} />
    <CustomList options={sample} />
  </>)
}

export default App
