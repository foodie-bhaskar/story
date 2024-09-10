import { FC, useState } from 'react';
import { PacketItemQty } from "@/App.type";

const PacketQty: FC<PacketItemQty> = ({ itemId, name, qty }) => {

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

    const [realizedTheme] = useState<string>('active');

    return (
        <li className="flex flex-row-reverse items-center group justify-end py-2">
            <div className="peer-hover:border-red-700 flex pe-8 py-2 gap-1 rounded border max-w-lg transition-opacity-250 duration-250 timing-ease-in-out bg-white ps-2">
                <div className='w-full y-4 px-2 flex self-center h-10 rounded gap-2'>
                    <div className={
                        `${colors[realizedTheme].textBG}
                     w-12 rounded text-center my-auto`}>{itemId}</div>
                    <span className='text-slate-700 inline-block w-64 my-auto'>{name}</span>
                </div>
                <div className='flex h-10 justify-center min-w-10 ps-2 items-center'>
                    <div 
                        className={`py-0.5 text-xl rounded-full uppercase min-w-20 inline-block px-auto
                        text-slate-700 bg-green-200 
                            font-bold text-center shadow-xs `}>
                        {qty}
                    </div>
                </div>
            </div>
        </li>
    );
}
  
export default PacketQty;