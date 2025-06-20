import { FC, useState, useEffect } from 'react';
import Loader from '@/core/Loader';

type CountProps = {
    count?: number,
    array?: Array<any>,
    label: string,
    isLoading?: boolean,
    isID?: boolean,
    isWide?: boolean,
    size?: string,
    numStatus?: string,
    active?: boolean,
    clickable?: boolean,
    onClickFn?: Function
}

const Count: FC<CountProps> = ({ count, label, isLoading, array, isID, isWide, size, numStatus, active, clickable, onClickFn }) => {

    const [number, setNumber] = useState(array ? array.length : count);

    useEffect(() => {
        // alert(`${label} : ${array?.length}`);
        if (array) {
            setNumber(array.length);
        } else {
            setNumber(count);
        }
        
    }, [array, count]);

    interface Size {
        w: string,
        h: string,
        numText: string
    }

    const SIZES: { [key: string]: Size } = {
        'small': {
            w: 'w-36',
            h: 'h-20',
            numText: 'text-5xl'
        },
        'medium': {
            w: 'w-48',
            h: 'h-30',
            numText: 'text-6xl'
        }
    }

    const statusColor: { [key: string]: string | undefined } = {
        good: 'text-green-800',
        warn: 'text-orange-500',
        bad: 'text-red-600'
    }

    const width = isWide ? 'w-80': (size ? SIZES[size].w: 'w-60');
    const height = size ? SIZES[size].h: 'h-40';
    const num = size ? SIZES[size].numText: 'text-7xl';

    const numColor = isID ? 'text-gray-500 font-serif' : numStatus? statusColor[numStatus]: 'text-indigo-700';

    return (<div onClick={() => {
        if (onClickFn && clickable) {
            onClickFn()
        }
    }}
        className={`rounded ${height} ${width} flex flex-col ${isID ? 'border-4 border-gray-500': 'border border-gray-700 '}
    ${clickable && !active ? 'hover:border-8 hover:border-yellow-500 hover:cursor-pointer': ''}
    ${active ? 'border-8 border-indigo-900': ''}`}>
        {!isLoading && <div className={`w-full inline-block ${num} font-bold 
            ${numColor}
             basis-3/4 text-center align-middle flex flex-col justify-around`}
        >
            {number}
        </div>}
        {isLoading && <div className='basis-3/4 text-center align-middle'><Loader /></div>}
        <div className={`rounded-l-none rounded-r-none w-full text-lg uppercase font-semibold ${isID ? 'bg-gray-500' : 'bg-gray-700'} 
            inline-block text-white basis-1/4 rounded text-center py-1
            `}>{label}</div>
    </div>)
}

export default Count;