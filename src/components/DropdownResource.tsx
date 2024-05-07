import { FC, useState } from 'react';

import { DropdownOpts, Option } from '../App.type';
import CustomList from '../core/CustomList';
import CustomOptionForm, { FoodieText } from '../core/CustomOptionForm';
import Dropdown from '../core/Dropdown';

export const BASE_DROPDOWN: DropdownOpts = {
    name: '',
    assetLinked: '',
    global: true,
    options: []
} 

const DropdownResource: FC<DropdownOpts> = ({ name }) => {

    const [options, setOptions] = useState<Option[]>([]);

    const [dropdownName, setDropdownName] = useState(name);

    const assets = [
        { value: 'store', name: 'Store' },
        { value: 'rid', name: 'RID' },
        { value: 'brand', name: 'Brand' },
        { value: 'item', name: 'Item' },
        { value: 'product', name: 'Product' },
    ]
      

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


    return (<div className="container mx-auto border">
    <div className="flex flex-row flex-wrap py-4 border border-red-400">
      <main role="main" className="w-full sm:w-2/3 md:w-3/5 pt-1 px-2 border border-blue-400">
        <form className='ml-2'>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-xl font-semibold leading-7 text-gray-900">{!dropdownName ? 'New': 'Edit'} Dropdown</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide details to create a new dropdown resource for a particular asset and can make it global to be used by other resources also
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-2">
                <div className="border border-pink-700 sm:col-span-4">
                    <FoodieText label='Dropdown Name' fieldName='name' action={setDropdownName} value={dropdownName}/>
                </div>

                <div className="sm:col-span-3">
                    <Dropdown options={assets} name='Asset' />
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
            <CustomList options={options} optionAction={deleteOption} />
          </div>
      </aside>
    </div>
  </div>);
}

export default DropdownResource;