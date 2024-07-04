import { FC, useState, useEffect } from 'react';
import ItemList from '@/components/Itemlist';
import ItemQtyForm from '@/components/ItemQtyForm';
import { ItemQtyOtps } from "@/App.type";
import TransButton from '@/core/TransButton';

type PdtItem = {
    data?: ItemQtyOtps[],
    update: Function,
    readOnly?: boolean
}

const ProductItems: FC<PdtItem> = ({ data, update, readOnly }) => {
    let borderOn = false;
    // borderOn = true;
    
    const [showItemForm, setShowItemForm] = useState<boolean>(false);
    const [items, setItems] = useState<ItemQtyOtps[]>(data || []);
    const [itemError, setItemError] = useState<string>();
    const [tags, setTags] = useState<string[]>([]);

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
            let tagsUpdate: string[] = [...tags, name];
            update([...items, itemQty], tagsUpdate);
            setTags(tagsUpdate)
            setItemError('');
        }
    }

    useEffect(() => {
        if (data && data.length) {
            setItems(data);
        }
    }, [data])

    return (<div className={`${borderOn ? 'border border-yellow-500': ''}`}>
        {!readOnly && !showItemForm && <div className='inline-flex gap-2 flex-row w-full space-around ps-10 -mt-2 mb-2'>
            <TransButton label='Assign Item and quantity' update={() => setShowItemForm(true)} />
        </div>}
        {showItemForm && <ItemQtyForm action={addItem} errorMessage={itemError} />}

        <ItemList items={items} />            
    </div>)
}

export default ProductItems;