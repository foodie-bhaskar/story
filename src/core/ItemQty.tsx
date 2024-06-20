import { FC } from 'react';
import { ItemQtyOtps } from '../App.type';

const ItemQty: FC<ItemQtyOtps> = ({ item, qty }) => {
    const { itemId, name } = item;
    return (
        <li key={itemId} className="group flex pe-8 py-2 gap-1 rounded-lg w-md max-w-lg transition-opacity-250 duration-250 timing-ease-in-out bg-white">
            
            <div className='w-full y-4 px-2 flex self-center h-10 rounded gap-2'>
                <div className='w-12 bg-slate-500 text-white rounded text-center my-auto'>{itemId}</div>
                <span className='text-slate-700 inline-block w-40 my-auto'>{name}</span>
            </div>
            <div className='w-12 flex h-10 justify-center group/btn min-w-10 ps-2 items-center'>
                <button className={`w-8 h-8 rounded-full bg-blue-500 cursor-default`}>
                    {qty < 100 && <span className='text-slate-100 text-xs'>x</span>}
                    <span className='text-white text-l'>{qty}</span>
                </button>
            </div>
        </li>
    );
}
  
export default ItemQty;