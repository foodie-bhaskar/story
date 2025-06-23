import { FC } from 'react';

/* const Swiggy: FC<{ orderId?: string }> = ({ orderId }) => {
    return <div className={`text-center flex items-center justify-center px-1 font-bold leading-tight h-8 rounded
        text-white bg-orange-500`}>
        { orderId || 'Swiggy' } 
    </div>
}
 */
const Agg2: FC<{ type: string, orderId?: string, size?: string }> = ({ type, orderId, size }) => {

    let sizeDefault = size || 'large';

    if (!orderId) {
        sizeDefault = 'small'
    }

    interface Styles {
        bs: string,
        h: string,
        t: string
    }

    const SZING_CHRT:  { [key: string]: Styles } = {
        'large': {
            bs: 'border-4',
            h: 'h-12',
            t: 'text-2xl'
        },
        'small': {
            bs: 'border-4',
            h: 'h-8',
            t: 'text-l'
        }
    }

    const { bs, h, t } = SZING_CHRT[sizeDefault]

    const borderColor = type == 'zomato' ? 'border-red-700': 'border-orange-500';
        return <div className={`text-center flex items-center justify-center ${t} font-semibold leading-tight
        ${h} rounded text-slate-600 ${bs} ${borderColor} px-2`}>
        { orderId || type.toUpperCase() } 
    </div>
}

export default Agg2;
