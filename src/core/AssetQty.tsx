import { FC, useState } from 'react';
import { MinusCircleIcon } from '@heroicons/react/16/solid';

export interface AssetQtyOtps {
    id: string,
    name: string,
    qty: number,
    readOnly?: boolean,
    action?: Function,
    theme?: string
}

const AssetQty: FC<AssetQtyOtps> = ({ id, name, qty, readOnly, action, theme }) => {

    type ColorTheme = {
        btn: string,
        textBG: string
    }

    interface ColorThemes {
        [key: string]: ColorTheme;
    }
      
    const colors: ColorThemes = {
        active: {
          btn: 'bg-blue-500',
          textBG: 'bg-slate-500 text-white',
        },
        disabled: {
          btn: 'bg-gray-400',
          textBG: 'text-gray-400 bg-gray-50',
        }
    }

    const [realizedTheme] = useState<string>(!!readOnly? (theme? 'active': 'disabled'): 'active');

    return (
        <li className="flex flex-row-reverse items-center group justify-end py-2">
            <div className='w-12 flex h-10 justify-center group/btn min-w-10 ps-2 peer'>
                {!readOnly && action && typeof action === 'function' && 
                    <button className="self-center cursor-pointer
                    hover/btn:bg-red-200 hover/btn:rounded-full
                    group-hover/btn:p-1"
                    onClick={() => {
                        action(id);
                    }}>
                        <MinusCircleIcon className='size-4 text-red-600 group-hover/btn:text-red-700 group-hover/btn:size-5'/>
                    </button>
                }
            </div>
            <div className="peer-hover:border-red-700 flex pe-8 py-2 gap-1 rounded border max-w-lg transition-opacity-250 duration-250 timing-ease-in-out bg-white ps-10">
                <div className='w-full y-4 px-2 flex self-center h-10 rounded gap-2'>
                    <div className={
                        `${colors[realizedTheme].textBG}
                     w-12 rounded text-center my-auto`}>{id}</div>
                    <span className='text-slate-700 inline-block w-40 my-auto'>{name}</span>
                </div>
                <div className='w-12 flex h-10 justify-center min-w-10 ps-2 items-center'>
                    <button className={`w-8 h-8 rounded-full 
                        ${colors[realizedTheme].btn}
                         cursor-default`}>
                        {qty < 100 && <span className='text-slate-100 text-xs'>x</span>}
                        <span className='text-white text-l'>{qty}</span>
                    </button>
                </div>
            </div>
        </li>
    );
}
  
export default AssetQty;