import { FC, useState, useEffect } from 'react';
import { ProductAsset } from '../App.type';
import ChipItem from '@/core/Chipltem';

type Name = {
    name:  string,
    products: ProductAsset[],
    onSelect: Function
}

function findContains(name: string, products: ProductAsset[]) {
    let similar = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));

    if (similar && similar.length > 0) {
        return similar;
    } else {
        return [];
    }
}

function findSimilar(name: string, products: ProductAsset[]) {
    let similar = products.filter(p => p.name.toLowerCase().startsWith(name.toLowerCase()));

    if (similar && similar.length > 0) {
        return similar;
    } else {

        const nameTokens = name.split(' ');

        if (nameTokens.length == 1) {
            return findContains(name, products);
        } else {
            const partial = nameTokens.slice(0, nameTokens.length - 1).join(' ');
            // alert(`No matches for [${name}], so trying with : (${partial})`)
            return findSimilar(partial, products);
        }
    }
}

const StringFilterChips: FC<Name> = ({ name, products, onSelect }) => {

    const [filtered, setFiltered] = useState(products);
    const [selected, setSelected] = useState('');

    function action(id: string, data: ProductAsset) {
        if (id) {
            setSelected(id);
            onSelect(data);
        }
    }

    useEffect(() => {
        const similar = findSimilar(name, products)
        setFiltered(similar.slice(0, 10));

    }, [name, products]);

    return (<div className='flex flex-col gap-2'>
        {filtered.length > 0 && filtered.map((p: ProductAsset) => <ChipItem id={p.assetId} name={p.name} key={p.id} update={action} selected={selected == p.assetId} data={p} />)}
        {filtered.length == 0 && <div className='h-80 flex justify-center items-center border-slate-400'>
            <p className='text-slate-400 italic'>
                No similar products found<br />
                Please create manually
            </p>
        </div>}
    </div>);
}
  
export default StringFilterChips;