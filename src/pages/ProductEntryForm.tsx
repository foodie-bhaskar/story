import { FC, useEffect, useState } from 'react';

import Button from '@/core/Button';
import Loader from '@/core/Loader';
import ProductItems from '@/components/ProductItems';
import ProductPackages from '@/components/ProductPackages';
import { AbstractProductAsset, ItemQtyOtps, PackageQtyOtps } from '@/App.type';
import { isProductFormValid } from '@/lib/utils';

type ProductFormOpts = {
    readOnly: boolean,
    update: Function,
    product: AbstractProductAsset
}

const ProductEntryForm: FC<ProductFormOpts> = ({ readOnly, update, product }) => {
    let borderOn = false;
    // borderOn = true;

    const [isLoading, setIsLoading] = useState(false);

    const [valid, setValid] = useState(false);

    const [items, setItems] = useState<ItemQtyOtps[]>(product.items || []);
    const [packages, setPackages] = useState<PackageQtyOtps []>(product.packages || []);
    const [isRO, setIsRO] = useState(readOnly);

    
    const addItemQty = (items: ItemQtyOtps[]) => {
        // alert(`change : ${JSON.stringify(items)}`)
        setItems(items)
    }
    
    useEffect(() => {
        // alert(items.length);
        setValid(isProductFormValid(items, packages, product));
        
    }, [items, packages, product]);
    
    useEffect(() => {
        setIsRO(readOnly);
    }, [readOnly]);

    return (<div className={`border border-gray-400 rounded`}>

        <div className={`${borderOn ? 'border-red-800': ''} my-10 flex flex-row`}>
            <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} basis-6/12 border-r border-cyan-900 px-2`}>
                <ProductItems update={addItemQty} data={items} readOnly={isRO} />
            </main>
            <aside className="basis-6/12 ps-10">
                <ProductPackages update={setPackages} data={packages} readOnly={isRO} />
            </aside>
        </div>

        <div className='px-10 pb-10'>
            {!isLoading && <Button label={product.items ? 'Update': 'Map'} update={async () => {
                setIsLoading(true);
                await update(items, packages);
                setIsLoading(false);
            }} valid={valid} />}
            {isLoading && <Loader />}
        </div>
    </div>);
}

export default ProductEntryForm;