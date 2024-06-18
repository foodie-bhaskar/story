import { FC, useEffect, useState } from 'react';
import FoodieText from '../core/FoodieText';
import { BuildUpComboOpts } from '../App.type';

const BuildUpCombo: FC<BuildUpComboOpts> = ({ name, update, stages }) => {
    const borderOn = false;
    // const borderOn = true;

    const [buildUp, setBuildUp] = useState(stages.map(stg => {
        const { field, value } = stg;
        return  { value: value || 0, field }
    }));

    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let valid = true;

        for (let i = 1; i < buildUp.length; i++) {
            if (buildUp[i].value < buildUp[i-1].value) {
                valid = false;
            }
        }

        setHasError(!valid);

        if (!valid) {
            update([]);
        } else {
            update(buildUp);
        }
    }, [buildUp])


    return (<fieldset className="">
        <legend className='uppercase font-medium text-gray-500 '>{name}</legend>
        {hasError && <p className='text-red-400'>Build up has errors, values need to be increasing</p>}
        {/* <div className='flex flex-row pt-4 pb-8 justify-between'> */}
        <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row space-x-10`}>
            {stages.length && stages.length <= 6 && stages.map((stage, i) => <div className={`basis-1/${stages.length}`}>
                <FoodieText label={stage.label} fieldName={stage.field} action={(val: string) => {
                    let combo = [...buildUp];
                    combo[i] = { field: stage.field, value: parseInt(val)}
                    setBuildUp(combo);
                }} value={`${buildUp[i].value}`} size='w-full' />
            </div>)}
        </div>
    </fieldset>)
}

export default BuildUpCombo;