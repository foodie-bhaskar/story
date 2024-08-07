import { FC, useEffect, useState } from 'react';
import { ChoiceOpts } from '../App.type';

/*
 * Displays N choices
 */
const Choice: FC<ChoiceOpts> = ({ label, choices, selectedValue, selectedCallback, position, readOnly }) => {
    let borderOn = false;
    // borderOn = true;
    const [selChoice, setSelChoice] = useState(selectedValue);

    const flexCss = position && position == 'BELOW' ? '' : 'flex flex-row items-center gap-10 min-w-80';

    useEffect(() => {
        if (selectedValue)
            setSelChoice(selectedValue)
    }, [selectedValue]);

    const color =  readOnly ? 'bg-slate-600': 'bg-blue-500';

    return (<div className={`${borderOn ? 'border border-red-100': ''}   ${flexCss}`}>
        <div className={`${borderOn ? 'border border-red-100': ''} text-sm font-medium text-gray-600`}>{label}</div>
        <div className={`${borderOn ? 'border border-red-100': ''} flex flex-row gap-2`}>
            {choices.map(c =>
                <div className="py-2">
                    <button disabled={readOnly}
                        className={`w-10 h-10 rounded-full text-white ${readOnly? '': 'hover:bg-slate-700 '}
                           ${c == selChoice ? color: 'bg-slate-300'}
                        `}
                        onClick={() => {
                            setSelChoice(c);
                            selectedCallback(c);
                        }}
                    >
                        {c}
                    </button>
                </div>
            )}
        </div>
    </div>);
}

export default Choice;