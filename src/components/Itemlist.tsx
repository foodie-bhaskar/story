import { FC, useState, useEffect } from 'react';
import { ItemQtyOtps } from '../App.type';
import ItemQty from '@/core/ItemQty';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

type ItemList = {
    items:  ItemQtyOtps[],
    readOnly?: boolean,
    update?: Function,
    theme?: string
}

const ItemList: FC<ItemList> = ({ items, readOnly, update, theme }) => {

    const [current, setCurrent] = useState<ItemQtyOtps[]>(items);

    const uxHide = true;

    const remove = (itemId: string) => {
        let rows = [...current].filter(item => item.item.itemId != itemId)
        setCurrent(rows);

        if (update && typeof update == 'function') {
            update(rows);
        }
    }

    useEffect(() => {
        setCurrent(items);
    }, [items])

    return (
        <div className="sm:container sm:mx-auto">
            <h1 className='mb-4 text-sm font-bold text-gray-500 uppercase'>Items</h1>
            {current.length == 0 && <h1 className='mb-4 italic font-light text-gray-500 text-sm'>No items</h1> }
            
            {!uxHide && current.length > 0 && <div className='text-gray-400 mb-2 items-center sm:mx-auto ps-11 pe-7 rounded-lg max-w-lg h-14 flex justify-between border-2'>
                {current.length} mapped
                <ChevronUpIcon className='size-6 '/>
            </div>}

            {current.length > 0 && <ul className='rounded-lg sm:mx-auto max-w-lg'>
                {current.map(o => <ItemQty key={o.item.itemId} item={o.item} qty={o.qty} readOnly={readOnly} action={remove} theme={theme} />)}
            </ul>}
        </div>
    );
}
  
export default ItemList;