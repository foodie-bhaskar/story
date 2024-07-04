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
    showBorder?: boolean
}

const ProductView: FC<ProductViewOpts> = ({ data, update, btnLabel, readOnly, showBorder }) => {
    // let borderOn = false;
    // borderOn = true;

    const [isActedUpon, setIsActedUpon] = useState(false);

    useEffect(() => {
        // alert(data.assetId)
        if (data.assetId) {
            setIsActedUpon(false);
        }
    }, [data.assetId])

    return (<div className={`${showBorder ? 'border border-slate-500': ''} space-y-10 bg-white rounded py-10 h-96`}>
        <ItemList items={data.items} readOnly={readOnly} />

        <PackageList packages={data.packages} readOnly={readOnly} />  

        <div className='flex flex-row justify-center'>
            {!isActedUpon && <Button label={btnLabel} update={async () => {
                    setIsActedUpon(true);
                    await update(data);
                }} valid={true} isSecondary={readOnly} />}
        </div>
    </div>)
}

export default ProductView;