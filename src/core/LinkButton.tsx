import { FC } from 'react';
import { NavigateFunction } from 'react-router-dom';

type ButtonProps = {
    label: string,
    to: string,
    nav: NavigateFunction,
    showAsButton?: boolean
}

const LinkButton: FC<ButtonProps> = ({ label, to, nav, showAsButton }) => {
    const themeClass = showAsButton 
        ? 'text-indigo-500  bg-indigo-50 hover:bg-indigo-100'
        : 'text-indigo-50 bg-indigo-500 hover:bg-indigo-700';
    
    return showAsButton 
        ? <button 
            type='button' 
            onClick={() => {
                nav(to)
            }}
            className={`py-2.5 px-6 text-sm rounded uppercase h-10
                ${showAsButton
                    ? `cursor-pointer transition-all duration-500 ${themeClass}`
                    : 'cursor-not-allowed text-gray-300 bg-gray-100 '}
                    font-semibold text-center shadow-xs rounded`}>
                {label}
            </button>
        : <button 
            type='button' 
            onClick={() => {
                nav(to)
            }}
            className={`py-2.5 px-4 text-sm rounded uppercase -ml-4 font-regular text-center shadow-xs bg-white 
                cursor-pointer text-indigo-500  transition-all duration-500 hover:bg-indigo-200`}>
            {label}
        </button>;
}

export default LinkButton;