import { FC, useEffect, useState, useRef } from "react";
import CalendarDayBtn from '@/core/CalendarDayBtn';
import CircleValue from '@/core/CircleValue';
import { convertToDayNameFormat, calculateDaysDifference, formattedDate } from '@/lib/utils';
import { Range } from '@/App.type';

interface DateBoxProps {
    showBorder?: boolean;
    date?: string;
    position?: 'start' | 'end'; // Determines the border rounding
    disabled?: boolean,
    handleChange: Function
}

const DateBox: FC<DateBoxProps> = ({ showBorder = false, date = '', position = 'end', disabled = true, handleChange }) => {
    const [borderOn] = useState(showBorder);

    const borderRadius =
        position === 'start'
            ? 'rounded-tr-[10px] rounded-br-[10px]' // Start box
            : 'rounded-tl-[10px] rounded-bl-[10px]'; // End box

    const [text, setText] = useState(date || formattedDate());

    const setDate = (dt: string) => {
        setText(dt);
        handleChange(dt);
    }

    return (
        <div
            className={`border-dotted border-2 h-10 w-96 ps-2
            ${date && disabled ? 'bg-slate-300 border-grey-400': 'border-cyan-900 bg-cyan-100'} 
             flex flex-row items-center justify-between ${borderRadius}`}
        >
            <h1 className={`${borderOn ? 'border border-red-700' : ''} text-md text-slate-600 font-semibold uppercase`}>
                {convertToDayNameFormat(text)}
            </h1>
            <CalendarDayBtn update={setDate} date={text}/>
        </div>
    );
};

interface RangeOpts {
    showBorder?: boolean,
    range: Range,
    onRangeChange: Function
}

const Dotted = () => {
    return <div className="border-t border-green-800 border-dotted w-full h-0"></div>
}

const RangeBox: FC<RangeOpts> = ({ showBorder, range, onRangeChange }) => {

    const [borderOn] = useState(showBorder || false);

    const [days, setDays] = useState<number>();
    const [dateRange, setDateRange] = useState<Range>(range);

    const [start, setStart] = useState<string>();
    const [end, setEnd] = useState<string>();

        // 1. Create refs at the top of your component
    const prevStart = useRef(start);
    const prevEnd = useRef(end);

    const today = formattedDate();

    useEffect(() => {   
        const { start, end } = dateRange;
        const diff = calculateDaysDifference(start, end || today);
        // alert(diff);
        setDays(diff);
        onRangeChange(dateRange);
    }, [dateRange]);

    useEffect(() => {
        const startChanged = start !== prevStart.current;
        const endChanged = end !== prevEnd.current;
      
        if (startChanged && start) {
          const dtRnge = { start, end: dateRange.end };
        //   alert(`Start date updated: ${JSON.stringify(dtRnge)}`);
          setDateRange(dtRnge);
        } else if (endChanged && end) {
          const dtRnge = { start: dateRange.start, end };
        //   alert(`End date updated: ${JSON.stringify(dtRnge)}`);
          setDateRange(dtRnge);
        }
      
        prevStart.current = start;
        prevEnd.current = end;
      }, [start, end]);

    return <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row gap-2 justify-between items-center`}>
        <DateBox showBorder={borderOn} date={dateRange.start} position="start" handleChange={setStart} />
        <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row gap-2 items-center w-full`}>
            <Dotted />
            <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row gap-2 items-center`}>
                <div><CircleValue value={`${days}`} /></div>
                <h4 className="font-thin text-xl italic text-gray-400">days</h4>
            </div>
            <Dotted />
        </div>
        <DateBox showBorder={borderOn} date={dateRange.end} handleChange={setEnd}/>
    </div>
}

export default RangeBox;