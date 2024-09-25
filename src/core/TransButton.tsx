
import { FC } from 'react';

type ButtonProps = {
    label: string,
    update: Function,
    showAsButton?: boolean
}
const TransButton: FC<ButtonProps> = ({ label, update, showAsButton }) => {
    const themeClass = showAsButton 
        ? 'text-indigo-50 bg-indigo-500 hover:bg-indigo-700 text-md font-medium'
        : 'bg-white text-indigo-500 hover:bg-indigo-200 -ml-4 text-sm font-regular';

    return <button 
        type='button' 
        onClick={() => {
            update()
        }}
        className={`py-2.5 px-4  rounded uppercase text-center shadow-xs 
            cursor-pointer ${themeClass} transition-all duration-500 `}>
        {label}
    </button>

}

export default TransButton;