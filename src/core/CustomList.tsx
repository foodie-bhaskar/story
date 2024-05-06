import { FC, useState, useEffect } from 'react';
import { ListOptions } from '../App.type';
import CustomOption from './CustomOption';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

const CustomList: FC<ListOptions> = ({ options, action }) => {

    const [current, setCurrent] = useState(options);

    useEffect(() => {
        setCurrent(options);
    }, [options])

    return (
        <div className="sm:container sm:mx-auto px-4">
            <div className='text-gray-400 bg-slate-50 my-2 items-center ps-11 pe-7 rounded-lg max-w-lg h-14 flex justify-between border-2'>
                {current.length} options added
                <ChevronUpIcon className='size-6 '/>
            </div>
            {current.length > 0 && <ul className='divide-y divide-gray-200 border-2 rounded-lg sm:mx-auto max-w-lg'>
                {current.map(o => <CustomOption key={o.value} name={o.name} value={o.value} action={action} />)}
            </ul>}
            <div className='mb-8 inline-flex gap-2 mt-10 flex-row-reverse w-full'>
                <button 
                    type='button' 
                    className={`py-2.5 px-6 text-sm bg-indigo-50 rounded-full 
                        ${current.length > 0 ? 'cursor-pointer text-indigo-500': 'cursor-not-allowed text-indigo-300'}
                        font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-100`}>
                        Save
                </button>
            </div>
        </div>
    );
}
  
export default CustomList;