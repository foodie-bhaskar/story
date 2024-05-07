import { FC, useState } from 'react';

import { DropdownOpts, Option } from '../App.type';
import CustomList from '../core/CustomList';
import CustomOptionForm, { FoodieText, FoodieCheckbox } from '../core/CustomOptionForm';
import Dropdown from '../core/Dropdown';

export const BASE_DROPDOWN: DropdownOpts = {
    name: '',
    assetLinked: '',
    global: true,
    options: []
} 

const DropdownResource: FC<DropdownOpts> = ({ name, assetLinked, global }) => {

    const [options, setOptions] = useState<Option[]>([]);

    const [dropdownName, setDropdownName] = useState(name);
    const [selectedAsset, setSelectedAsset] = useState(assetLinked);
    const [isGlobal, setIsGlobal] = useState(global || true);

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


    return (<div className="container mx-auto bg-white rounded-lg border border-blue-700">
    <div className="flex flex-row flex-wrap py-4">
      <main role="main" className="w-full sm:w-2/3 md:w-3/5 pt-1 px-12">
        <form className='ml-2 pe-40'>
          <div className="space-y-12">
            <div className="border-gray-900/10 pb-12 bg-red-50">
              <h2 className="text-xl font-semibold leading-7 text-gray-900">{!dropdownName ? 'New': 'Edit'} Dropdown</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide details to create a new dropdown resource for a particular asset and can make it global to be used by other resources also
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
                <div className="sm:col-span-3">
                    <FoodieText label='Dropdown Name' fieldName='name' action={setDropdownName} value={dropdownName}/>
                </div>

                <div className="sm:col-span-3">
                    <Dropdown options={assets} name='For Asset' selectedValue={assetLinked}
                      selectedCallback={(selected: Option) => {
                        console.log('Selected option: ', selected);
                        setSelectedAsset(selected.value);
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
  </div>);
}

export default DropdownResource;