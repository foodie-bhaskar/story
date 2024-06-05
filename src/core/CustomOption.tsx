import { FC } from 'react';
import { Option } from '../App.type';
import { ArchiveBoxXMarkIcon } from '@heroicons/react/16/solid';

const nameDerivedValue = (name: string) => {
    let tokens = name.split(' ');
    return tokens.map(t => t.toLowerCase()).join('-');
}

const CustomOption: FC<Option> = ({ name, value, action }) => {
    return (
        <li key={value} className="group flex pe-8 py-2 gap-1 hover:bg-slate-300 rounded-lg w-md max-w-lg transition-opacity-250 duration-250 timing-ease-in-out bg-white">
            <div className='w-12 flex h-10 justify-center group/btn min-w-10 ps-2'>
                {action && typeof action === 'function' && <button className="hidden group-hover:block self-center cursor-pointer
                 group-hover/btn:bg-slate-200 group-hover/btn:rounded-full
                 group-hover/btn:p-1"
                 onClick={ () => {
                    action(value);
                }}>
                    <ArchiveBoxXMarkIcon className='size-4 text-gray-500 group-hover/btn:size-5'/>
                </button>}
            </div>
            <div className='w-full y-4 flex justify-between self-center'>
                <span className='text-slate-700 inline-block group-hover:text-blue-800 w-48 cursor-pointer'>{name}</span>
                { nameDerivedValue(name) !== value && <div className='w-32 bg-slate-500 text-white rounded text-center'>{value}</div> }
            </div>
        </li>
    );
}
  
export default CustomOption;