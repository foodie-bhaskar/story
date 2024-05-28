import { FC, useState, useEffect } from 'react';
import { FieldOpts } from '../App.type';

const FoodieText: FC<FieldOpts> = ({ label, fieldName, action, value, readOnly, size }) => {
    // const [disabled, setDisabled] = useState(readOnly);
    const [extVal, setExtVal] = useState(value);
    const [val, setVal] = useState(value);

    const update = (e: any) => {
        setVal(e.target.value);
        if (action && typeof action == 'function') {
            action(e.target.value);
        }
    }

    useEffect(() => {
        setExtVal(value);
        // setVal(value);
    }, [value]);

    return (<>
        <label htmlFor={fieldName} className="block text-sm font-medium leading-6 text-gray-600 group-has-[input]/toggle:hidden">
            {label}
        </label>
        <div className={`mt-2 ${size || 'w-full'}`}>
            <input
                type="text"
                name={fieldName}
                id={fieldName}
                value={readOnly ? extVal: val}
                onChange={update}
                readOnly={readOnly}
                className={`block w-full rounded-md border-0 py-1.5 p-4
                shadow-sm 
                placeholder:text-gray-400 ${readOnly 
                    ? 'text-gray-400 bg-slate-100'
                    : 'text-gray-900 focus:ring-2 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-400'
                    } sm:text-sm sm:leading-6`}
            />
        </div>  
    </>);
}

export default FoodieText;