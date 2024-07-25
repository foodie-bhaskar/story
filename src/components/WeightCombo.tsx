import { FC, useEffect, useState } from 'react';
import FoodieText from '../core/FoodieText';
import { WeightComboOpts } from '../App.type';

const WeightCombo: FC<WeightComboOpts> = ({ update, wt, readOnly }) => {
    let borderOn = false;
    // borderOn = true;

    const [weight, setWeight] = useState(wt ? wt : {
        main: 0,
        gravy: 0,
        total: 100
    });

    useEffect(() => {
        update(weight);
    }, [weight])


    return (<div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row gap-10`}>
        <div className='basis-1/3'>
            <FoodieText label='Main ingredient weight(in gms)' fieldName='main' action={(val: string) => {
                const main = parseInt(val);
                const { gravy } = weight;
                const total = parseInt(val) + parseInt(`${gravy}`);

                setWeight({
                    gravy,
                    main,
                    total
                })
            }} value={`${weight.main}`} size='w-2/5' readOnly={readOnly} />
        </div>
        <div className='basis-1/3'>
            <FoodieText label='Gravy weight(in gms)' fieldName='gravy'action={(val: string) => {
                const gravy = parseInt(val);
                const { main } = weight;
                const total = parseInt(val) + parseInt(`${main}`);

                setWeight({
                    gravy,
                    main,
                    total
                })
            }} value={`${weight.gravy}`} size='w-2/5' readOnly={readOnly} />
        </div>

        <div className='basis-1/3'>
            <FoodieText label='Total weight(in gms)' fieldName='total' value={`${weight.total}`} size='w-2/5' readOnly={true} />
        </div>
            
    </div>)
}

export default WeightCombo;