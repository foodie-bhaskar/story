import { FC } from "react";
import { ProductionBatchCache } from "@/App.type";
import { convertISOToISTFormat } from '@/lib/utils';
import { Trash2, Undo2 } from 'lucide-react';
import Loader from "@/core/Loader";

interface FormHeaderProps {
    batch?: ProductionBatchCache,
    close: Function,
    isLoading?: boolean,
    isConfirm?: boolean
}

const FormHeader: FC<FormHeaderProps> = ({ batch, isConfirm = false, close, isLoading }) => {

  const theme = isConfirm 
    ? 'bg-white hover:bg-red-600'
    : 'bg-green-700 hover:bg-white';
    
  return <div className={`bg-green-200 w-full px-2 py-2 h-14 flex justify-between items-center rounded-t`}>
    <div className={`flex flex-row w-11/12 justify-between items-center text-green-700 text-lg font-light`}>
      <div className="basis-1/12 font-light">
        <div className="basis-1/12 font-light">Batch # <span className="text-gray-500 text-xl font-medium">{batch && batch.batchNo}</span></div>
      </div>
        
      <div className="basis-3/12 flex flex-col justify-start"></div>
        
      <div className="basis-2/12 font-light">
          Items: {batch && batch.items && <span className="text-gray-500 text-xl font-medium">{batch.items.length}</span>}
      </div>
        
      <div className="basis-2/12 font-light">
        Packets: {batch && batch.batchPackets && <span className="text-gray-500 text-xl font-medium">{batch.batchPackets}</span>}
      </div>
        
      <div className="basis-3/12 flex flex-row gap-6 items-center">
        <div className='inline-block text-2xl font-bold text-gray-500 text-start align-middle'>
          {batch && <>{convertISOToISTFormat(batch.batchTime).split(',')[1]}</>}
        </div>
      </div>
    </div>
      
    { isLoading 
      ? <Loader size={8}/>
      : <button onClick={() => close()} disabled={isLoading} className="group">
          <div className={`${theme} w-10 h-10 rounded-full text-center flex justify-center items-center group-disabled:bg-white`}>
            {isConfirm 
              ? <Trash2 className="h-6 w-6 text-red-500 font-extrabold text-xl group-hover:text-white" />
              : <Undo2 className="h-6 w-6 text-white font-extrabold text-xl group-hover:text-green-700" />
            }
          </div>
        </button>
    }
  </div>
}

export default FormHeader;