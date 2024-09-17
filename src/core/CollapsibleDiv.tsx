import { FC, ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, CircleAlert } from 'lucide-react';
import { convertISOToISTFormat, isDateString } from '@/lib/utils';

interface CollapsibleDivProps {
  info: string[];
  children: ReactNode;
  initiallyOpen?: boolean;
  className?: string,
  custom?: string
}

const CollapsibleDiv: FC<CollapsibleDivProps> = ({ 
  info, 
  children, 
  className,
  initiallyOpen = false,
  custom
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(initiallyOpen);

  return (
    <div className={`${className ? className: ''} border border-gray-200 rounded overflow-hidden`}>
      <button
        className={`${isOpen ? 'bg-green-50': 'bg-gray-300'} group w-full px-4 py-2 h-14 transition-colors duration-200 flex justify-between items-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`flex flex-row w-11/12 justify-between items-center ${isOpen ? 'text-green-800 text-lg font-light': 'text-slate-600 text-lg font-medium italic'}`}>
            {info.map(text => {
                const isDate = isDateString(text);
                let textStr = text;
                if (isDate) {
                  const [ dateDay, ] = text.split('T');
                  const [day, time] = convertISOToISTFormat(text).split(',');
                  textStr = time;
                  return <div className="flex flex-row gap-6 items-center">
                      <div className='inline-block text-2xl font-bold text-gray-500 text-start align-middle'>
                        {time}
                      </div>
                      {dateDay != custom && <div className="bg-white rounded h-10 flex flex-row w-40 px-4 items-center gap-4">
                        <CircleAlert className="h-5 w-5 text-red-600 my-auto" />
                        <span className="text-red-800 text-xl font-normal">{day}</span>
                      </div>}
                    </div>
                } else {
                  return <span className={``}>{textStr}</span>
                }
            })}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500 mr-3" />
        ) : (<div className={`w-10 h-10 rounded-full bg-gray-100 group-hover:bg-green-100 text-center flex justify-center items-center`}>
          <ChevronDown className="h-6 w-6 text-gray-700 font-extrabold" />
          </div>
        )}
      </button>
      <div
        className={` bg-white transition-all duration-200 ease-in-out ${
          isOpen ? 'min-h-72 opacity-100 px-4 py-2s' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleDiv;