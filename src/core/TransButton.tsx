
import { FC } from 'react';

type ButtonProps = {
    label: string,
    update: Function,
    showAsButton?: boolean,
    theme?: string
}

type StringMap = {
    [key: string]: string
}

const themeClassMap: StringMap = {
    'button': 'text-indigo-50 bg-indigo-500 hover:bg-indigo-700 text-md font-medium',
    'confirm': 'text-orange-600 font-regular bg-white hover:bg-yellow-100 text-lg hover:font-bold w-40',
    'default': 'bg-white text-indigo-500 hover:bg-indigo-200 -ml-4 text-sm font-regular'
}
const TransButton: FC<ButtonProps> = ({ label, update, showAsButton, theme }) => {
    const themeKey: string = showAsButton 
        ? (theme && theme == 'confirm' ? theme: 'button')
        : 'default';


    const themeClass: string = themeClassMap[themeKey];

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