import { FC, useState, useEffect } from 'react';

type ChipProps = {
    value: string,
    isLoading?: boolean,
    label: string,
    isActive?: boolean,
    update: Function
}

const ChipButton: FC<ChipProps> = ({ value, label, isLoading, isActive, update }) => {
    const [active, setActive] = useState(isActive || false);

    useEffect(() => {
        // alert(`${value} is not active: ${isActive}`);
        setActive(isActive || false);
    }, [isActive]);
    
    return (<button 
        type='button' 
        disabled={active}
        onClick={() => {
          setActive(true);
          update(value)
        }}
        className={`py-2.5 px-6 text-sm rounded-full uppercase
            ${isLoading
              ? '  text-white bg-green-700 cursor-not-allowed animate-pulse italic font-light'
              : (
                active ? '  text-yellow-400 bg-green-700 cursor-not-allowed '
                : ' font-thin text-slate-700 bg-green-200 cursor-pointer transition-all duration-500 hover:bg-green-600 hover:text-yellow-400 hover:font-medium'
                )
            }
            font-semibold text-center shadow-xs `}>
            {label}
        </button>)
}

export default ChipButton;