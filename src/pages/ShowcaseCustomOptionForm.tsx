import { FC, useState, useEffect } from 'react';

import { DropdownOpts, Option, DropdownFormOpts } from '../App.type';
import CustomOptionForm from '../core/CustomOptionForm';

const ShowcaseCustomOptionForm = () => {
    const [ddnOptions, setDdnOptions] = useState<Option[]>([]);

    const addToList = (name: string, value: string) => {

        const names = ddnOptions.map(o => o.name);
        const values = ddnOptions.map(o => o.value);
    
        if (!names.includes(name.trim()) && !values.includes(value.trim())) {
          if (name.trim() == value.trim()) {
            let tokens = value.trim().split(' ');
            let valueString = tokens.map(t => t.toLowerCase()).join('-');
            setDdnOptions([...ddnOptions, { name: name.trim(), value: valueString }]);
          } else {
            setDdnOptions([...ddnOptions, { name: name.trim(), value: value.trim() }]);
          }
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
        <p>{JSON.stringify(ddnOptions)}</p>
        <CustomOptionForm action={addToList} />
    </div>)

}

export default ShowcaseCustomOptionForm;