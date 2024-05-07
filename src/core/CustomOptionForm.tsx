import { FC, useState, useEffect } from 'react';
import { Field, FormAction } from '../App.type';

export const FoodieText: FC<Field> = ({ label, fieldName, action, value, readOnly }) => {
    const [val, setVal] = useState(value);

    const update = (e: any) => {
        setVal(e.target.value);
        if (action && typeof action == 'function') {
            action(e.target.value);
        }
    }

    useEffect(() => {
        setVal(value);
    }, [value])

    return (<>
        <label htmlFor={fieldName} className="block text-sm font-medium leading-6 text-gray-900">
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

const FoodieToggle: FC<Field> = ({ label, action, active }) => {

    const [checked, setChecked] = useState<boolean>(active || false);

    const toggle = (e: any) => {
        if (action && typeof action == 'function') {
            action(e.target.checked);
        }
        setChecked(e.target.checked);
    }

    return(
        <label className="relative flex items-center mb-5 cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" onChange={toggle} checked={checked} />
            <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-transparent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700 "></div>
            <span className="ml-3 text-sm font-medium text-gray-600 ">{label}</span>
        </label>
    );
}

const CustomOptionForm: FC<FormAction> = ({ action }) => {
    const [isSame, setIsSame] = useState(true);

    const [optionName, setOptionName] = useState<string>();
    const [optionVal, setOptionVal] = useState<string>();
    const [ready, setReady] = useState<boolean>(false);

    const duplicate = (isDuplicate: boolean) => {
        setIsSame(isDuplicate);

        if (isDuplicate) {
            setOptionVal(optionName);
        } else {
            setOptionVal('')
        }
    }

    const updateName = (name: string) => {
        setOptionName(name);
        if (isSame) {
            setOptionVal(name);
        }
    }

    const add = () => {
        const name = `${optionName}`;
        const val = `${optionVal}`;
        
        setOptionVal('');
        setOptionName('');

        action(name, val);
    }

    useEffect(() => {
        setReady(!!optionName && !!optionVal)
    }, [optionName, optionVal]);

    useEffect(() => {
        duplicate(true);
    }, [])

    return (
        <fieldset className="">
            <legend className='uppercase'>Create Option</legend>
            
            <div className=""><FoodieText label='Option' fieldName='option-name' action={updateName} value={optionName}/></div>

            <div className='mt-12'>
                <FoodieToggle label='Use option name as value' fieldName='is-option-value-same' active={isSame} action={duplicate}/>
                
                {isSame && <FoodieText label='Value' fieldName='option-value' value={optionVal} readOnly={true} />}

                {!isSame && <FoodieText label='Value' fieldName='option-value' value={optionVal} action={setOptionVal} />}
            </div>

            <div className='mb-8 inline-flex gap-2 mt-10 flex-row-reverse w-full'>
                <button 
                    type='button' onClick={add} disabled={!ready}
                    className={`py-2.5 px-6 text-sm bg-indigo-500 text-white rounded-full font-semibold text-center shadow-xs transition-all duration-500
                        ${ready ? 'cursor-pointer hover:bg-indigo-700 bg-indigo-500': 'bg-indigo-200 cursor-not-allowed'}`}>
                        Add Option
                </button>
                
            </div>
        </fieldset>
    );
}
  
export default CustomOptionForm;
