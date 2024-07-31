import { FC, useState, useEffect } from 'react';
import { ProductAsset } from "@/App.type";
import ItemList from './Itemlist';
import PackageList from './PackageList';
import Button from '@/core/Button';

type ProductViewOpts = {
    data: ProductAsset,
    update: Function,
    readOnly?: boolean,
    btnLabel: string,
    theme?: string,
    name?: string
}

const ProductView: FC<ProductViewOpts> = ({ data, update, btnLabel, readOnly, theme, name }) => {
    let borderOn = false;
    // borderOn = true;

    const [isActedUpon, setIsActedUpon] = useState(false);

    useEffect(() => {
        // alert(data.assetId)
        if (data.assetId) {
            setIsActedUpon(false);
        }
    }, [data.assetId])

    return (<div className={`${theme && theme == 'active' ? 'border border-slate-500': ''} space-y-10 bg-white rounded py-10 min-h-96`}>
        {!readOnly && <h4 className={`text-slate-700 font-semibold ml-8 -my-6`}>{name}</h4>}
        {readOnly && <h4 className={`text-indigo-500 font-normal ml-8 -my-6`}>{data.name}</h4>}
        <ItemList items={data.items} readOnly={readOnly} theme={theme} />

        <PackageList packages={data.packages} readOnly={readOnly} theme={theme} />  

        <div className='flex flex-row justify-center'>
            {!isActedUpon && <Button label={btnLabel} update={async () => {
                    setIsActedUpon(true);
                    await update(data);
                }} valid={true} isSecondary={readOnly} />}
        </div>
    </div>)
}

export default ProductView;