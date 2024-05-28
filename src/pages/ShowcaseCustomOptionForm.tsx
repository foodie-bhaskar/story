import { FC, useState, useEffect } from 'react';

import { DropdownOpts, Option, DropdownFormOpts } from '../App.type';
import CustomOptionForm from '../core/CustomOptionForm';

const ShowcaseCustomOptionForm = () => {
    const [ddnOptions, setDdnOptions] = useState<Option[]>([]);

    const addToList = (name: string, value: string) => {

        const names = ddnOptions.map(o => o.name);
        const values = ddnOptions.map(o => o.value);
    
        if (!names.includes(name.trim()) && !values.includes(value.trim())) {
          setDdnOptions([...ddnOptions, { name, value }]);
        } else {
          if (names.includes(name)) {
            alert(`Option name [${name}] already exists`);
          }
    
          if (values.includes(value)) {
            alert(`Option value [${value}] already exists`);
          }
        }
      }

    return (<div className="flex flex-col mt-10 p-10 md:w-3/6 mx-auto border border-gray-700 bg-white rounded-sm h-max">
        <CustomOptionForm action={addToList} />
    </div>)

}

export default ShowcaseCustomOptionForm;