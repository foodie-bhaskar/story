import { FC, useEffect, useState } from 'react';

type ButtonProps = {
    label: string,
    update: Function,
    valid: boolean,
    isSecondary?: boolean
}
const Button: FC<ButtonProps> = ({ label, update, valid, isSecondary }) => {

    const [isActive, setIsActive] = useState(valid);

    const themeClass = isSecondary 
        ? 'text-indigo-500  bg-indigo-50 hover:bg-indigo-100'
        : 'text-indigo-50 bg-indigo-500 hover:bg-indigo-700';

    useEffect(() => {
        if (valid) {
            setIsActive(valid)
        }
    }, [valid])

    return <button 
        type='button' 
        disabled={!isActive}
        onClick={() => update()}
        className={`py-2.5 px-6 text-sm rounded uppercase h-10
            ${isActive
                ? `cursor-pointer transition-all duration-500 ${themeClass}`
                : 'cursor-not-allowed text-gray-300 bg-gray-100 '}
                font-semibold text-center shadow-xs rounded`}>
            {label}
    </button>

}

export default Button;