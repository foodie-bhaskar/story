import { FC, useState } from 'react';
import { SequenceChoiceOpts } from '../App.type';
import Choice from './Choice';

export const BASE_SEQCHOICE_OPTS = {
    type: 'number',
    label: 'default example',
    size: 5,
    selectedValue: '4',
    selectedCallback: (selectedChoice: string) => {
        alert(`This is chosen: ${selectedChoice}`);
    }
}

const getSequence = (size: number, step = 1) => {
    const sequence = [];
    let last = 0;

    for (let i = 0; i < size; i++) {
        last += step
        sequence.push(`${last}`);
    }

    return sequence;
}

/*
 * Displays N sequenced choices
 */
const SeqChoice: FC<SequenceChoiceOpts> = ({ label, position, size, selectedValue, step, selectedCallback }) => {
    const borderOn = false;
    // const borderOn = true;
    const sequence = getSequence(size, step);

    const [selChoice, setSelChoice] = useState(selectedValue);

    return <Choice label={label} choices={sequence} selectedValue={selectedValue} selectedCallback={selectedCallback} position={position} />

    /* return (<div className={`${borderOn ? 'border border-red-100': ''} min-w-80 flex flex-row items-center gap-10`}>
        <div className='text-sm font-medium text-gray-600 h-fit'>{label}</div>
        <div className='my-2 flex flex-row gap-2'>
            {sequence.map(n =>
                <div className="py-2">
                    <button 
                        className={`w-10 h-10 rounded-full text-white hover:bg-slate-700 
                            ${selChoice && parseInt(selChoice) == n ? 'bg-blue-500': 'bg-slate-300'}
                        `}
                        onClick={() => {
                            // alert(`sle; ${n}`);
                            setSelChoice(`${n}`);
                            selectedCallback(n);
                        }}
                    >
                        {n}
                    </button>
                </div>
            )}
            
 

        </div>
    </div>); */
}

export default SeqChoice;