import { FC, useState, useEffect } from 'react';
import Loader from '@/core/Loader';

type CountProps = {
    count?: number,
    array?: Array<any>,
    label: string,
    isLoading?: boolean,
    isID?: boolean
}

const Count: FC<CountProps> = ({ count, label, isLoading, array, isID }) => {

    const [number, setNumber] = useState(array ? array.length : count);

    useEffect(() => {
        // alert(`${label} : ${array?.length}`);
        if (array) {
            setNumber(array.length);
        } else {
            setNumber(count);
        }
        
    }, [array, count])

    return (<div className={`rounded h-40 w-60 flex flex-col ${isID ? 'border-4 border-gray-500': 'border border-gray-700 '} pt-5`}>
        {!isLoading && <div className={`w-full inline-block text-7xl font-bold ${isID ? 'text-gray-500 font-serif' : ' text-indigo-700'} basis-3/4 text-center align-middle`}>{number}</div>}
        {isLoading && <div className='basis-3/4 text-center align-middle'><Loader /></div>}
        <div className={`rounded-l-none rounded-r-none w-full text-lg uppercase font-semibold ${isID ? 'bg-gray-500' : 'bg-gray-700'} 
            inline-block text-white basis-1/4 rounded text-center py-2
            `}>{label}</div>
    </div>)
}

export default Count;