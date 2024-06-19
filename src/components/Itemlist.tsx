import { FC, useState, useEffect } from 'react';
import { ItemQtyOtps } from '../App.type';
import ItemQty from '@/core/ItemQty';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

type ItemList = {
    items:  ItemQtyOtps[]
}

const ItemList: FC<ItemList> = ({ items }) => {

    const [current, setCurrent] = useState<ItemQtyOtps[]>(items);

    useEffect(() => {
        setCurrent(items);
    }, [items])

    return (
        <div className="sm:container sm:mx-auto px-4">
            <h1 className='mb-4 text-xxl text-grey-600'>Items with Qty</h1>
            <div className='text-gray-400 my-2 items-center sm:mx-auto ps-11 pe-7 rounded-lg max-w-lg h-14 flex justify-between border-2'>
                {current.length} different kind of items
                <ChevronUpIcon className='size-6 '/>
            </div>
            {current.length > 0 && <ul className='divide-y divide-gray-200 border rounded-lg sm:mx-auto max-w-lg ps-10'>
                {current.map(o => <ItemQty item={o.item} qty={o.qty} />)}
            </ul>}
        </div>
    );
}
  
export default ItemList;