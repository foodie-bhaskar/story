import { FC, useEffect, useState } from 'react';
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
    // let borderOn = false;
    // borderOn = true;
    const sequence = getSequence(size, step);

    const [selChoice, setSelChoice] = useState(selectedValue);

    useEffect(() => {
        if (selectedValue)
            setSelChoice(selectedValue)
    }, [selectedValue]);

    return <Choice label={label} choices={sequence} selectedValue={selChoice} selectedCallback={selectedCallback} position={position} />

}

export function isSeqChoice(component: any): component is typeof SeqChoice {
  
    return (
        component &&
        typeof component === 'object' &&
        component instanceof SeqChoice // Use instanceof instead of typeof
    );
  }

export default SeqChoice;