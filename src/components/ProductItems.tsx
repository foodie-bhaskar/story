import { FC, useState } from 'react';
import ItemList from '@/components/Itemlist';
import ItemQtyForm from '@/components/ItemQtyForm';
import { ItemQtyOtps } from "@/App.type";

type PdtItem = {
    data?: ItemQtyOtps[],
    update: Function
}

const ProductItems: FC<PdtItem> = ({ data, update }) => {
    let borderOn = false;
    // borderOn = true;
    
    const [showItemForm, setShowItemForm] = useState<boolean>(false);
    const [items, setItems] = useState<ItemQtyOtps[]>(data || []);
    const [itemError, setItemError] = useState<string>();

    const addItem = (itemQty: ItemQtyOtps) => {
        let { itemId, name } = itemQty.item;

        const itemIds = items.map(iq => iq.item.itemId);

        if (itemIds.includes(itemId)) {
            setItemError(`Item ${itemId}-${name} is already added`);
        } else if (itemQty.qty > 100) {
            setItemError(`Item Quantity cannot be more than 100`);
        } else {
            setShowItemForm(false);
            setItems([...items, itemQty]);
            update([...items, itemQty]);
            setItemError('');
        }
    }

    return (<div className={`${borderOn ? 'border border-yellow-500': ''}`}>
        {!showItemForm && <div className='inline-flex gap-2 flex-row w-full space-around ps-10 -mt-2 mb-2'>
            <button 
                type='button' 
                onClick={() => {
                    setShowItemForm(true);
                }}
                className={`py-2.5 px-6 text-sm rounded uppercase
                    cursor-pointer text-indigo-500  bg-white transition-all duration-500 hover:bg-indigo-200
                    font-semibold text-center shadow-xs `}>
                Assign Item and quantity
            </button>
        </div>}
        {showItemForm && <ItemQtyForm action={addItem} errorMessage={itemError} />}

        <ItemList items={items} />            
    </div>)
}

export default ProductItems;