import { FC, useState } from 'react';
import { AppProps, Option } from './App.type';
import CustomList from './core/CustomList';
import CustomOptionForm from './core/CustomOptionForm';

const App: FC<AppProps> = () => {
  
  const [options, setOptions] = useState<Option[]>([]);

  const deleteOption = (value: string) => {
    setOptions(options.filter(o => o.value !== value));
  }

  const addToList = (name: string, value: string) => {

    const names = options.map(o => o.name);
    const values = options.map(o => o.value);

    if (!names.includes(name) && !values.includes(value)) {
      setOptions([...options, { name, value }]);
    } else {
      if (names.includes(name)) {
        alert(`Option name [${name}] already exists`);
      }

      if (values.includes(value)) {
        alert(`Option value [${value}] already exists`);
      }
    }
  }

  return (<>
    <div className="container mx-auto">
      <div className="flex flex-row flex-wrap py-4">
        <main role="main" className="w-full sm:w-2/3 md:w-3/5 pt-1 px-2">
          <form className='ml-2'>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                      Username
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          autoComplete="username"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="janesmith"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                      Country
                    </label>
                    <div className="mt-2">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className='mx-3 p-4 border w-2/4 rounded-lg'>
          <CustomOptionForm action={addToList} />
          </div>
        </main>
        <aside className="w-full sm:w-1/3 md:w-2/5 px-2 h-full border-l">
            <div className="sticky top-0 p-4 w-full mt-10">
              <CustomList options={options} action={deleteOption} />
            </div>
        </aside>
      </div>
    </div>
  </>)
}

export default App
