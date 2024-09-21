import { FC } from 'react';

type CircleValueProps = {
    value: string,
    level?: number
}

const CircleValue: FC<CircleValueProps> = ({ value }) => {
    return (<div className="">
        <div 
            className={`w-10 h-10 rounded-full text-white bg-slate-400 text-center py-2`}
        >
            {value}
        </div>
    </div>);
}

export default CircleValue;
