import { FC, useState } from 'react';
import { SequenceChoiceOpts } from '../App.type';

export const BASE_SEQCHOICE_OPTS = {
    type: 'number',
    label: 'default example',
    size: 5,
    selected: '4',
    callback: (selectedChoice: string) => {
        alert(`This is chosen: ${selectedChoice}`);
    }
}

const getSequence = (size: number, step = 1) => {
    const sequence = [];
    let last = 0;

    for (let i = 0; i < size; i++) {
        last += step
        sequence.push(last);
    }

    return sequence;
}

/*
 * Displays N sequenced choices
 */
const SeqChoice: FC<SequenceChoiceOpts> = ({ label, type, size, selected, step, callback }) => {
    const sequence = getSequence(size, step);

    const [selChoice, setSelChoice] = useState(selected);

    return (<div className='border border-red-100 min-w-80 px-10 flex flex-row items-center gap-10'>
        <div className='text-md font-medium leading-6 text-gray-900 h-fit'>{label}</div>
        <div className='my-2 flex flex-row gap-2'>
            {sequence.map(n =>
                <div className="py-2">
                    <button 
                        className={`w-10 h-10 rounded-full text-white hover:bg-slate-700 
                            ${selChoice && parseInt(selChoice) == n ? 'bg-blue-500': 'bg-slate-300'}
                        `}
                        onClick={() => {
                            setSelChoice(`${n}`);
                            callback(n);
                        }}
                    >
                        {n}
                    </button>
                </div>
            )}
            
 

        </div>
    </div>);
}

export default SeqChoice;