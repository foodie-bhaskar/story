import { FC, useState } from "react";
import { ProductAsset } from "@/App.type";
import ProductView from "./ProductView";
import StringFilterChips from "./StringFilterChips";
import Loader from "@/core/Loader";

interface PdtCopierOpts {
    productName: string,
    availableProducts: ProductAsset[],
    update: Function
}

const ProductCopier: FC<PdtCopierOpts> = ({ productName, availableProducts, update }) => {
    let borderOn = false;
    // borderOn = true;

    const [similarProduct, setSimilarProduct] = useState<ProductAsset>();
    const [copiedProduct, setCopiedProduct] = useState<ProductAsset>();

    const [isLoading, setIsLoading] = useState(false);

    return <div className={`flex flex-row mx-10 min-h-96 gap-1 ${borderOn ? 'border border-green-700': ''}`}>
        <div className={`basis-2/5 py-4 pe-4 ${!copiedProduct ? 'border border-slate-400': ''}`}>
            {copiedProduct 
                ? (isLoading ? <div className='h-96 text-center align-middle'><Loader /></div>
                    : <ProductView data={copiedProduct} btnLabel='Create Mapping' showBorder={true} 
                        update={async () => {
                            setIsLoading(true);
                            const tags = copiedProduct.items.map(item => item.item.name)
                            await update(copiedProduct.items, copiedProduct.packages, tags);
                            setIsLoading(false);
                        }} 
                    />
                )
                : <div className='h-80 flex justify-center items-center'>
                    <span className='text-slate-400 italic'>Please copy a product from the right</span>
                </div>}
        </div>
       
        <div className={`flex flex-row basis-3/5 gap-2 bg-slate-200 rounded p-4 ${borderOn ? 'border border-green-400': ''}`}>
            <div className={`basis-3/5 ${borderOn ? 'border border-green-400': ''}`}>
                    {similarProduct && <ProductView data={similarProduct} btnLabel='Copy' update={setCopiedProduct} readOnly={true} />}
                    {!similarProduct && <div className='h-80 flex justify-center items-center border-r border-slate-400'>
                        <span className='text-slate-400 italic'>
                            {/* Total {availableProducts.length} products found <br /> */}
                            Click a product to view composition
                        </span>
                    </div>}
                </div>
                <div className={`basis-2/5 flex flex-row justify-center ${borderOn ? 'border border-green-400': ''}`}>
                    <StringFilterChips onSelect={setSimilarProduct} products={availableProducts} name={productName || ''} />
                </div>
            </div>
    </div>
}

export default ProductCopier;