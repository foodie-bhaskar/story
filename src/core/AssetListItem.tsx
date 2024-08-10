import { CheckCircleIcon } from "lucide-react";
import { FC, useState } from "react";

export interface AssetOtps {
    id: string,
    name: string,
    readOnly?: boolean,
    action?: Function,
    theme?: string,
    active?: boolean
}

const AssetListItem: FC<AssetOtps> = ({ id, name, readOnly, action, theme, active }) => {

    let borderOn = false;
    // borderOn = true;

    type ColorTheme = {
        btn: string,
        textBG: string,
        text: string,
        textId: string
    }

    interface ColorThemes {
        [key: string]: ColorTheme;
    }
      
    const colors: ColorThemes = {
        active: {
          btn: 'bg-blue-500',
          textBG: 'bg-slate-500 text-white',
          textId: 'text-gray-5  00 font-semibold',
          text: 'text-gray-500 font-light italic',
        },
        disabled: {
          btn: 'bg-gray-400',
          textBG: 'text-gray-400 bg-gray-50',
          textId: 'text-gray-600 font-medium',
          text: 'text-gray-400 font-light'
        }
    }

    const [realizedTheme] = useState<string>(!!readOnly? (theme? 'active': 'disabled'): 'active');

    return (
        <div className={`group flex flex-row items-center group justify-end py-2 rounded border border-gray-300
            ${ active ? 'bg-green-100': 'hover:bg-slate-200'}
            ${action && typeof action === 'function' ? 'cursor-pointer': ''}
            `}
            onClick={() => {
                if (action && typeof action === 'function') {
                    action(id);
                }
            }}
        >
            <div className={`${borderOn ? 'border border-red-700': ''} 
                ${id.length > 5 ? 'flex-col': 'flex-row'}
                w-full ps-2 flex self-center min-h-10 rounded gap-1`}>
                <div className={`
                    ${id.length > 5 
                        ? `flex-col ${colors[realizedTheme].textId}`
                        : `flex-row w-12 rounded text-center my-auto ${colors[realizedTheme].textBG}`
                    }`}>{id}</div>
                <span className={`inline-block min-w-40 my-auto
                    ${id.length > 5 
                        ? `${colors[realizedTheme].text}`
                        : ``
                    }`}>{name}</span>
            </div>
            <div className='w-12 flex h-10 justify-center min-w-10 ps-2 items-center'>
                {active && <button className="self-center" disabled={true}>
                            <CheckCircleIcon className='size-6 text-green-800'/>
                        </button>}

                {!active && !readOnly && action && typeof action === 'function' && 
                    <button className="hidden self-center cursor-pointer group-hover:block">
                        <CheckCircleIcon className='size-6 text-green-600'/>
                    </button>
                }
                </div>
        </div>)
}

export default AssetListItem;