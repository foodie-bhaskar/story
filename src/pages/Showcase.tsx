import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import ItemQty from '@/core/ItemQty';
import ItemList from '@/components/Itemlist';
import ItemQtyForm from '@/components/ItemQtyForm';
import ToggleComplex from "@/components/ToggleComplex";
import { DYNA_TYPE, DynamicFieldProps, ToggleCore, ToggleState, Option, ItemQtyOtps } from "@/App.type";
// import CustomOptionForm from '@/core/CustomOptionForm';

const ITEM = {
    itemId: '413',
    name: 'Vanilla Shake Mix'
}

const itemsWQty: ItemQtyOtps[] = [
    {
        item: ITEM,
        qty: 2
    },
    {
        item: { itemId: '22', name: 'Special Mutton Biryani'},
        qty: 1
    },
]

async function fetchUIResource(uiType: string, id: string) {  
    return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}&id=${id}`, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
        }
    })
}

const Showcase= () => {
    let borderOn = false;
    borderOn = true;
    
    const [items, setItems] = useState<ItemQtyOtps[]>(itemsWQty);

    return (<div className='lg-w-full mx-auto space-y-10'>
        <p>Showcase Item product</p>

        <div className={`${borderOn ? 'border-red-800': ''} mt-10 flex flex-row min-h-10 min-w-max justify-between`}>
            <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} basis-3/6 max-w-[600px]`}>
                <ItemQtyForm action={(itemQty: ItemQtyOtps) => {
                    setItems([...items, itemQty])
                }} />
            </main>
            <aside className=" basis-3/6">
                <ItemList items={items} />
            </aside>

        </div>
        
    </div>)
}

export default Showcase;