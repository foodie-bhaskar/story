import { FC, useState } from 'react';
import { ToggleOpts } from '../App.type';

const FoodieToggle: FC<ToggleOpts> = ({ label, action, active, readOnly }) => {

    const [checked, setChecked] = useState<boolean>(active || false);

    const toggle = (e: any) => {
        if (action && typeof action == 'function') {
            action(e.target.checked);
        }
        setChecked(e.target.checked);
    }

    const checkedColor = readOnly && active ? 'peer-checked:bg-gray-400': 'peer-checked:bg-indigo-500 hover:peer-checked:bg-indigo-700';

    return(
        <label className={`relative flex items-center ${readOnly ? 'cursor-not-allowed': 'cursor-pointer'} h-5`}>
            <input type="checkbox" value="" className="sr-only peer" onChange={toggle} checked={checked} disabled={readOnly} />
            <div className={`w-9 h-5
             ${readOnly ? 'bg-gray-400': 'bg-gray-200 hover:bg-gray-400'}
             peer-focus:outline-0 rounded-full 
             peer transition-all ease-in-out duration-500 
             peer-checked:after:translate-x-full peer-checked:after:border-transparent 
             after:content-[''] after:absolute after:top-[2px] after:left-[2px]
              after:bg-white after:border-gray-300 after:border after:rounded-full 
              after:h-4 after:w-4 after:transition-all dark:border-gray-600
              ${checkedColor} `}></div>
            <span className="ml-3 text-sm font-regular text-gray-500 peer-checked:text-gray-700">{label}</span>
        </label>
    );
}

export default FoodieToggle;