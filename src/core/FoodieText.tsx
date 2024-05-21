import { FC, useState, useEffect } from 'react';
import { FieldOpts } from '../App.type';

const FoodieText: FC<FieldOpts> = ({ label, fieldName, action, value, readOnly }) => {
    const [val, setVal] = useState(value);

    const update = (e: any) => {
        setVal(e.target.value);
        if (action && typeof action == 'function') {
            action(e.target.value);
        }
    }

    useEffect(() => {
        setVal(value);
    }, [value, readOnly])

    return (<>
        <label htmlFor={fieldName} className="block text-sm font-medium leading-6 text-gray-900 group-has-[input]/toggle:hidden">
            {label}
        </label>
        <div className="mt-2">
            <input
            type="text"
            name={fieldName}
            id={fieldName}
            value={val}
            onChange={update}
            readOnly={!!readOnly}
            className={`block w-full rounded-md border-0 py-1.5 p-4
              shadow-sm ring-1 ring-inset ring-gray-300
              placeholder:text-gray-400 ${readOnly ? 'text-gray-400 bg-slate-100': 'text-gray-900'}
              focus:ring-2 focus:ring-inset focus:ring-indigo-600 
              sm:text-sm sm:leading-6`}
            />
        </div>  
    </>);
}

export default FoodieText;