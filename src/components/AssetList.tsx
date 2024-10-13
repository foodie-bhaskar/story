import { AssetItem, AssetProduct } from "@/App.type";
import AssetListItem from "@/core/AssetListItem";
import { FC, useState, useEffect } from "react";

interface AssetListOpts {
    data: AssetItem[] | AssetProduct[],
    update?: Function
}

const AssetList: FC<AssetListOpts> = ({ data, update }) => {

    const [selectedItem, setSelectedItem] = useState<string>();
    const [items, setItems] = useState<AssetItem [] | AssetProduct[]>(data);

    useEffect(() => {
        setItems(data);
    }, [data])

    return <>{items && items.length > 0 && <ul className='rounded sm:mx-auto max-w-lg overflow-y-scroll h-screen pb-8'>
        {items.map(o => <li key={o.assetId} className="my-2">
            <AssetListItem id={o.assetId} name={o.name} action={(assetId: string) => {
                setSelectedItem(assetId);

                if (update && typeof update === 'function') {
                    update(o);
                }
                
            }} active={selectedItem == o.assetId} />
        </li>)}
        <li className="flex flex-row gap-2 justify-around items-center my-4">
            <div className="h-0.5 basis-4/12 bg-gray-500"></div>
            <div className="h-2 basis-2 bg-gray-500 rounded-full"></div>
            <div className="h-0.5 basis-4/12 bg-gray-500"></div>
        </li>
    </ul>}</>
}

export default AssetList;