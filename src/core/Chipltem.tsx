import { FC, useState, useEffect } from 'react';

type ChipItemProps = {
    id?: string,
    name: string,
    selected?: boolean,
    update: Function,
    data: any
}

const ChipItem: FC<ChipItemProps> = ({ id, name, selected, update, data }) => {
    const [active, setActive] = useState(selected || false);

    useEffect(() => {
        setActive(selected || false);
    }, [selected]);
    
    return (<button 
        type='button' 
        disabled={active}
        onClick={() => {
          setActive(true);
          update(id, data)
        }}
        className={`py-2.5 px-6 text-sm rounded-full text-center
            ${ active 
                ? 'cursor-not-allowed text-indigo-500 bg-gray-100 font-semibold cursor-disabled'
                : 'cursor-pointer border border-gray-400 font-normal text-gray-400 bg-white transition-all duration-500 hover:bg-gray-100 hover:text-indigo-500 hover:font-medium'
            }`}>
            {name} - {id}
    </button>);
}

export default ChipItem;