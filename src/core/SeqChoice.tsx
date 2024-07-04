import { FC, useEffect, useState } from 'react';
import { SequenceChoiceOpts } from '../App.type';
import Choice from './Choice';
import FoodieText from './FoodieText';

export const BASE_SEQCHOICE_OPTS = {
    type: 'number',
    label: 'default example',
    size: 5,
    selectedValue: '4',
    selectedCallback: (selectedChoice: string) => {
        console.log(`This is chosen: ${selectedChoice}`);
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
const SeqChoice: FC<SequenceChoiceOpts> = ({ label, position, size, selectedValue, step, selectedCallback, allowMore }) => {
    let borderOn = false;
    // borderOn = true;
    const sequence = getSequence(size, step);

    const [selChoice, setSelChoice] = useState(selectedValue);

    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        if (selectedValue)
            setSelChoice(selectedValue)
    }, [selectedValue]);

    return (<div className={`${borderOn ? 'border border-green-400': ''} flex flex-row items-center justify-between`}>
        {!showMore && <Choice label={label} choices={sequence} selectedValue={selChoice} selectedCallback={selectedCallback} position={position} />}
        {showMore && <div className='flex flex-col'>
            <FoodieText label={label} action={selectedCallback} fieldName={label} size='w-20' type='number' />
        </div>}

        {allowMore && <span className='cursor-pointer inline-block text-xs text-blue-800 mt-6 italic' onClick={() => {
            setShowMore(!showMore);
        }}>{showMore ? 'Back' : 'Need more?'}</span>}
    </div>);
}

export function isSeqChoice(component: any): component is typeof SeqChoice {
  
    return (
        component &&
        typeof component === 'object' &&
        component instanceof SeqChoice // Use instanceof instead of typeof
    );
  }

export default SeqChoice;