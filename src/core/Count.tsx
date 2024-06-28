import { FC } from 'react';

type CountProps = {
    count: number,
    label: string
}

const Count: FC<CountProps> = ({ count, label }) => {
    return (<div className='rounded h-40 w-60 flex flex-col border border-gray-700 pt-5'>
        <div className='w-full inline-block text-7xl font-bold text-indigo-700 basis-3/4 text-center align-middle'>{count}</div>
        <div className='rounded-l-none rounded-r-none w-full text-lg uppercase font-semibold bg-gray-700 inline-block text-white basis-1/4 rounded text-center py-2'>{label}</div>
    </div>)
}

export default Count;