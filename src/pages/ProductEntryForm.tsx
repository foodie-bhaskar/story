import { FC, useEffect, useState } from 'react';

import Button from '@/core/Button';
import Loader from '@/core/Loader';
import ProductItems from '@/components/ProductItems';
import ProductPackages from '@/components/ProductPackages';
import { ItemQtyOtps, PackageQtyOtps } from '@/App.type';

type Product = {
    items: ItemQtyOtps[],
    packages: PackageQtyOtps[]
}

type ProductFormOpts = {
    readOnly?: boolean,
    update: Function,
    product?: Product
}

const ProductEntryForm: FC<ProductFormOpts> = ({ readOnly, update, product }) => {
    let borderOn = false;
    // borderOn = true;

    const [isLoading, setIsLoading] = useState(false);

    const [valid, setValid] = useState(false);

    const [items, setItems] = useState<ItemQtyOtps[]>(product && product.items ? product.items :[]);
    const [tags, setTags] = useState<string[]>([]);
    const [packages, setPackages] = useState(product && product.packages ? product.packages :[]);

    const addItemQty = (items: ItemQtyOtps[], tags: string[]) => {
        setItems(items)
        setTags(tags);
    }

    useEffect(() => {
        if (items && items.length && packages && packages.length && !product) {
            setValid(true);
        } else {
            setValid(false);
        }
    }, [items, packages, product]);

    useEffect(() => {
       if (product && product.items && product.packages) {
            setItems(product.items);
            setPackages(product.packages);
       }
    }, [product]);

    return (<div className={`border border-gray-400 lg-w-full mx-auto rounded`}>

        <div className={`${borderOn ? 'border-red-800': ''} my-10 flex flex-row min-w-max`}>
            <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} basis-6/12 border-r border-cyan-900 px-6`}>
                <ProductItems update={addItemQty} data={items} readOnly={readOnly || isLoading} />
            </main>
            <aside className=" basis-5/12 ps-10">
                <ProductPackages update={setPackages} data={packages} readOnly={readOnly || isLoading} />
            </aside>
        </div>

        <div className='px-10 pb-10'>
            {!isLoading && <Button label='Save' update={async () => {
                setIsLoading(true);
                await update(items, packages, tags);
                setIsLoading(false);
            }} valid={valid} />}
            {isLoading && <Loader />}
        </div>
    </div>);
}

export default ProductEntryForm;