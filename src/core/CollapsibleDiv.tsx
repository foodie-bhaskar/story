import { FC, ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, CircleAlert, FileText, Download } from 'lucide-react';
import { convertISOToISTFormat } from '@/lib/utils';
import { ProductionBatchCache } from "@/App.type";

interface CollapsibleDivProps {
  batch: ProductionBatchCache;
  children: ReactNode;
  initiallyOpen?: boolean;
  className?: string,
  custom?: string
}

const CollapsibleDiv: FC<CollapsibleDivProps> = ({ 
  batch, 
  children, 
  className,
  initiallyOpen = false,
  custom
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(initiallyOpen);

  const [ dateDay, ] = batch.batchTime.split('T');
  const [day, time] = convertISOToISTFormat(batch.batchTime).split(',');

  const now = new Date();

  const MAX = 4 * 60 * 60 * 1000;
  const TIME_LEFT = batch.linkExpiryTime ? batch.linkExpiryTime - now.getTime(): 0;

  // const intensityRange = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  // const intensity = Math.ceil((100 - Math.floor((TIME_LEFT*100)/MAX))/10);
  // const bgColor = `bg-red-${intensityRange[intensity]}`;

  return (
    <div className={`${className ? className: ''} border border-gray-200 rounded overflow-hidden`}>
      <div className={`${isOpen ? 'bg-green-50': 'bg-gray-300'} group w-full px-2 py-2 h-14 transition-colors duration-200 flex justify-between items-center`}>
        <div className={`flex flex-row w-11/12 justify-between items-center ${isOpen ? 'text-green-800 text-lg font-light': 'text-slate-600 text-lg font-medium italic'}`}>
          <div className="basis-1/12 font-light">Batch # <span className="text-gray-800 text-xl font-semibold">{batch.batchNo}</span></div>
          <div className="basis-3/12 flex flex-col justify-start">
            {TIME_LEFT > 0 && batch.downloadLink && <div className="bg-white mb-1 rounded h-8 flex flex-row justify-center">
              <a href={batch.downloadLink} download={`Downlaod`} 
                className={`inline-flex items-center px-4 py-2 bg-white text-blue-800 rounded w-full font-light justify-center
                transition-colors duration-300 hover:font-normal`}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Stickers
              </a>
            </div>}
            {TIME_LEFT <= 0 && <div className="bg-white mb-1 rounded h-8 flex flex-row justify-center items-center">
              <CircleAlert className="w-5 h-5 mr-6 text-red-600" />
              <span className={`text-red-800 mr-2`}>Link Expired</span>
              <FileText className="w-5 h-5 mr-2" />
            </div>}
            <div className="overflow-hidden h-1 text-xs flex bg-white">
              <div style={{ width: `${100 - Math.floor((TIME_LEFT*100)/MAX)}%` }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap justify-end bg-red-700`}></div>
            </div>
          </div>
          <div className="basis-2/12 font-light">Items: <span className="text-gray-800 text-xl font-semibold">{batch.items.length}</span></div>
          <div className="basis-2/12 font-light">Packets: <span className="text-gray-800 text-xl font-semibold">{batch.batchPackets}</span></div>
          <div className="basis-3/12 flex flex-row gap-6 items-center">
            <div className='inline-block text-2xl font-bold text-gray-500 text-start align-middle'>
              {time}
            </div>
            {dateDay != custom && <div className="bg-white rounded h-10 flex flex-row w-40 px-4 items-center gap-4">
              <CircleAlert className="h-5 w-5 text-red-600 my-auto" />
              <span className="text-red-800 text-xl font-normal">{day}</span>
            </div>}
          </div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500 mr-3" />
          ) : (<div className={`w-10 h-10 rounded-full bg-gray-100 group-hover:bg-green-100 text-center flex justify-center items-center`}>
            <ChevronDown className="h-6 w-6 text-gray-700 font-extrabold" />
            </div>
          )}
        </button>
      </div>
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