import { FC, useState } from 'react';
import { CheckboxOpts } from '../App.type';

const FoodieCheckbox: FC<CheckboxOpts> = ({ label, info, checkFn, checked }) => {
    const [enabled, setEnabled] = useState(checked);

    return (<div>
        <label className="block text-sm font-medium leading-6 text-gray-600 group-has-[input]/toggle:hidden">
            {label}
        </label>
        <div className="flex items-center mb-1 mt-2">
            <input id={label} type="checkbox" value="" onChange={ (e) => {
                setEnabled(e.target.checked);
                checkFn(e.target.checked);
            }} checked={enabled}
                className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            {info && <span className='text-xs italic text-gray-400'>{info}</span>}
        </div>
        
    </div>
    )
}

export default FoodieCheckbox;