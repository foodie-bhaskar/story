import { FC, useState, useEffect } from 'react';

import { DropdownOpts, Option, DropdownFormOpts } from '../App.type';
import CustomList from '../core/CustomList';
import CustomOptionForm, { FoodieText, FoodieCheckbox } from '../core/CustomOptionForm';
import Dropdown from '../core/Dropdown';

const CASCADE_OPTIONS: Option[] = [
  { value: 'brand-category', name: 'Brand Category' },
  { value: 'global', name: 'Global' }
];

export const BASE_DROPDOWN: DropdownFormOpts = {
    name: '',
    options: [],
    cascadeOptions: CASCADE_OPTIONS,
    callbackFn: (obj: Object) => {
      alert(JSON.stringify(obj));
    }
} 

const DropdownResource: FC<DropdownFormOpts> = ({ name, cascade, cascadeOptions, defaultValue, options, callbackFn }) => {

    const [ddnOptions, setDdnOptions] = useState<Option[]>(options || []);
    const [valid, setValid] = useState(false);

    const [dropdownName, setDropdownName] = useState(name);
    const [cascadeType, setCascadeType] = useState(cascade || 'global');
      

  const deleteOption = (value: string) => {
    alert(`Deleting ${value}`)
    // setOptions(options.filter(o => o.value !== value));
  }

  const addToList = (name: string, value: string) => {

    const names = options.map(o => o.name);
    const values = options.map(o => o.value);

    if (!names.includes(name) && !values.includes(value)) {
      setDdnOptions([...options, { name, value }]);
    } else {
      if (names.includes(name)) {
        alert(`Option name [${name}] already exists`);
      }

      if (values.includes(value)) {
        alert(`Option value [${value}] already exists`);
      }
    }
  }

  useEffect(() => {
    if (dropdownName && cascadeType) {
      setValid(true);
    }

  }, [dropdownName, cascadeType])


    return (<div className='container mx-auto bg-white rounded-lg border border-blue-700'>
      <div className="border-gray-900/10 w-full min-w-full text-center">
        <h2 className="text-xl uppercase font-semibold leading-7 text-gray-500">{!dropdownName ? 'New': 'Edit'} Dropdown</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Provide details to create a new dropdown resource either as a part of cascade hierarchy or global
        </p>
      </div>
      <div className="border-gray-900 w-full h-full flex flex-row flex-wrap">
        <main role="main" className="w-full sm:w-2/3 md:w-3/5 pt-1 px-12 border">
          <form className='ml-2 pe-40 border space-y-12 border-red-700'>
            <div className="border border-green-800">
              <FoodieText label='Name' fieldName='name' action={setDropdownName} value={dropdownName}/>
            </div>

            <div className="border border-green-800">
              <label htmlFor="visibility" className="block text-sm font-medium leading-6 text-gray-900">
                Visibility
              </label>
              <div className="mt-2">
                <div className="flex items-center mb-4">
                    <input id="visibility-global" type="radio" value="global" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Global</label>
                </div>
                <div className="flex items-center">
                    <input checked id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Checked state</label>
                </div>
              </div>
            </div>
          </form>
        </main>
        <aside className="w-full sm:w-1/3 md:w-2/5 px-10 py-10 min-h-screen/2 border"></aside>
      </div>
    </div>);
}

export default DropdownResource;

/* 
<div className="container mx-auto bg-white rounded-lg border border-blue-700">
    <div className="flex flex-row flex-wrap py-4">
      <main role="main" className="w-full sm:w-2/3 md:w-3/5 pt-1 px-12">
        <form className='ml-2 pe-40'>
          <div className="space-y-12">
            <div className="border-gray-900/10 pb-12 bg-red-50">
              <h2 className="text-xl font-semibold leading-7 text-gray-900">{!dropdownName ? 'New': 'Edit'} Dropdown</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide details to create a new dropdown resource either as a part of cascade hierarchy or global
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
                <div className="sm:col-span-3">
                    <FoodieText label='Dropdown Name' fieldName='name' action={setDropdownName} value={dropdownName}/>
                </div>

                <div className="sm:col-span-3">
                    <Dropdown options={cascadeOptions} name='Cascade' selectedValue={cascadeType}
                      selectedCallback={(selected: Option) => {
                        console.log('Selected cascade: ', selected);
                        setCascadeType(selected.value);
                      }}
                    />

                    <FoodieCheckbox label='Global' info='can be used by other assets' checkFn={setIsGlobal} checked={isGlobal} />
                </div>
                <div className='sm:col-span-3 mx-3 p-4 border rounded-lg'>
                  <CustomOptionForm action={addToList} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
      <aside className="w-full sm:w-1/3 md:w-2/5 px-10 py-10 min-h-screen/2 border-l">
          <div className="sticky top-0 p-4 w-full h-full bg-blue-50 rounded-lg">
            <CustomList options={options} optionAction={deleteOption} />
          </div>
      </aside>
    </div>
    <div className='border border-blue-900 px-10'>
      <div className='mb-8 inline-flex gap-2 mt-10 flex-row-reverse w-full'>
                <button 
                    type='button' 
                    onClick={() => callbackFn({
                      dropdownName,
                      cascadeType
                    })}
                    className={`py-2.5 px-6 text-sm bg-indigo-50 rounded-full 
                        ${valid ? 'cursor-pointer text-indigo-500': 'cursor-not-allowed text-indigo-300'}
                        font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-100`}>
                        Create Dropdown
                </button>
            </div>
    </div>
  </div> */