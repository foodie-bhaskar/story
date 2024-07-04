
import { FC } from 'react';

type ButtonProps = {
    label: string,
    update: Function
}
const TransButton: FC<ButtonProps> = ({ label, update }) => {
    return <button 
        type='button' 
        onClick={() => {
            update()
        }}
        className={`py-2.5 px-4 text-sm rounded uppercase -ml-4 font-regular text-center shadow-xs bg-white 
            cursor-pointer text-indigo-500  transition-all duration-500 hover:bg-indigo-200`}>
        {label}
    </button>

}

export default TransButton;