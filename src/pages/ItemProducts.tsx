import { AssetProduct, FilterOpts, ProductAsset } from "@/App.type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FoodieText from "@/core/FoodieText";
import AssetLoaderList from "@/components/AssetLoaderList";
import QueryLoaderList from "@/components/QueryLoaderList";
import ProductView from "@/components/ProductView";

const ItemProducts = () => {

    const [filter, setFilter] = useState<string>('');
    const [itemName, setItemName] = useState<string>('');
    const [apiFilter, setApiFilter] = useState<FilterOpts>({
        field: 'product',
        value: ''
    });

    const [selectedProduct, setSelectedProduct] = useState<ProductAsset>();

    const navigate = useNavigate();

    useEffect(() => {
        setApiFilter({
            field: 'product',
            value: itemName
        })
    }, [itemName])

    return (<div className='lg-w-full mx-auto h-full'>

        <div className="flex flex-row items-center gap-10 mx-4 my-10">
            <FoodieText label={'Item Name'} action={setFilter} value={filter} size='w-80' fieldName={'name'}  />
        </div>
        <div className="flex flex-row gap-2 min-h-full ps-4">
            <div className="basis-1/3 min-h-screen">
                <AssetLoaderList type={'item'} localFilter={{ value: filter }} update={(selected: any) => {
                    setItemName(selected.name)
                }} />
            </div>
            <div className="basis-1/3 h-full">
                <QueryLoaderList apiFilter={apiFilter} update={(selected: AssetProduct) => {
                    const product: ProductAsset = {
                        assetId: selected.assetId,
                        packages: selected.packages,
                        items: selected.items,
                        isVeg: selected.isVeg,
                        id: selected.assetId,
                        name: selected.name
                    }
                    setSelectedProduct(product);
                    // alert(JSON.stringify(selected));
                }} />
            </div>
            <div className="basis-1/3 h-full">
                {selectedProduct && <ProductView 
                    data={selectedProduct} 
                    btnLabel='View' 
                    update={(product: ProductAsset) => {
                        const vegTypePartial = product.isVeg ? 'veg': 'non-veg';
                        let url = `/product/${vegTypePartial}/${product.id}/${product.name}?page=view`
                        // alert(`View this product: ${url}`);
                        navigate(url);
                    }} 
                    readOnly={true} 
                />}
            </div>
        </div>
    </div>);
}

export default ItemProducts;