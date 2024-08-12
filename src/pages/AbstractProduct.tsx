import { useState, useEffect, FC } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from 'axios';

import { ItemQtyOtps, PackageQtyOtps, ProductAsset, AbstractProductAsset, Product } from '@/App.type';

import { updateAsset, fetchAssetsForType } from '../api/api';
import ProductEntryForm from './ProductEntryForm';
import TransButton from '@/core/TransButton';
import ProductCopier from '@/components/ProductCopier';
import FoodieToggle from '@/core/FoodieToggle';
import Loader from '@/core/Loader';

const assetType = 'abstract-product';

interface ProductManagerOpts {
    product: AbstractProductAsset,
    availableProducts: ProductAsset[],
    update: Function,
    isEditable?: boolean
}

const ProductManager: FC<ProductManagerOpts> = ({ update, product, availableProducts }) => {
    let borderOn = false;
    // borderOn = true;
    
    const [isView, setIsView] = useState(product.items ? true: false);

    return <div className={`${borderOn ? 'border border-green-700': ''} mx-10 `}>
        <div className='mb-4 w-full flex flex-row-reverse'>
            <FoodieToggle label='Editable' action={() => setIsView(!isView)} active={!isView} />
        </div>
        <ProductEntryForm readOnly={isView} update={update} product={product}/>
    </div>
}

const AbstractProduct = () => {
    let borderOn = false;
    // borderOn = true;

    let { productId } = useParams();

    const [isManual, setIsManual] = useState(false);
    
    
    const [product, setProduct] = useState<AbstractProductAsset>();
    
    const [oldMappedProducts, setOldMappedProducts] = useState<ProductAsset[]>([]);


    const [errorMessage, setErrorMessage] = useState<string>('');

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isFetching, isPending, error, data } = useQuery({
        queryKey: ['asset', assetType],
        queryFn: async () => {
          try {
            const data = await fetchAssetsForType(assetType);
            const rows = data.data.result;
            return rows;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true
    });

    const oldProducts = useQuery({
        queryKey: ['asset', 'product'],
        queryFn: async () => {
          try {
            const rows = await fetchAssetsForType('product');
            return rows.data;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true
    });

    const mutation = useMutation({
        mutationFn: async (assetItem: AbstractProductAsset) => {
            try {
                const response = await updateAsset(assetType, assetItem.assetId, assetItem);
                return response.data;
            } catch (err) {
                const error = err as AxiosError;
                throw error;
            }
        },
        onSuccess: () => setErrorMessage(''),
        onError: (error) => setErrorMessage(JSON.stringify(error))
    });

    const updateMapping = async (items: ItemQtyOtps[], packages: PackageQtyOtps[]) => {
        // alert(`updateMapping Mapping: ${JSON.stringify(items)} [${JSON.stringify(packages)}]`);
        if (product) {
            const body: AbstractProductAsset = {
                ...product,
                items,
                packages
            }
            // alert(JSON.stringify(body))

            await mutation.mutateAsync(body);

            setProduct({ ...product, items, packages });

            queryClient.setQueryData(['asset', assetType], (oldData: any) => {
                // Update the old data here and return the new data
                // alert(`${assetType} : ${oldData.length}`)
                const updateIdx = oldData.findIndex((ap: AbstractProductAsset) => ap.assetId == productId);
                // alert(`Updating product ${productId} [${product.name}] with updated data at index: ${updateIdx}`);
                
                let update = [ ...oldData ];
                const { primary, ...others } = update[updateIdx];
                // alert(`Existing obj: ${JSON.stringify(others)}`);
                update[updateIdx] = { ...others, items, packages, primary: 'ITEM#NAME' }
                return update;
            });
            navigate(-1);
        }
    } 

    useEffect(() => {
        if (isFetching) {
            
        } else if (!isPending && error) {
            
            if (axios.isAxiosError(error)) {
                setErrorMessage(`WARNING: ${error.response?.data}`);
                if (error.response && error.response.status == 404) {
                }
            } else {
                setErrorMessage(`WARNING: ${error.message}`);
            }
        } else if (!isPending && data) {
            
            const clickedProduct: AbstractProductAsset = data.find((pdt: AbstractProductAsset) => pdt.assetId == productId);

            if (clickedProduct) {
                setProduct(clickedProduct);
            } else {
                setErrorMessage(`No product found for this id : ${productId}`);
            }
        }
    
    }, [isPending, isFetching, error, data]);

    useEffect(() => {
        if (!oldProducts.isPending && oldProducts.error) {
            if (axios.isAxiosError(oldProducts.error)) {
                setErrorMessage(`WARNING: ${oldProducts.error.response?.data}`);
                if (oldProducts.error.response && oldProducts.error.response.status == 404) {
                }
            } else {
                setErrorMessage(`WARNING: ${oldProducts.error.message}`);
            }
        } else if (!oldProducts.isPending && oldProducts.data) {
            setOldMappedProducts(oldProducts.data.result);
        }
    
    }, [oldProducts.isPending, oldProducts.isFetching, oldProducts.error, oldProducts.data]);

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return (<div className='lg-w-full mx-auto'>
        <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row mx-10 my-4 justify-between items-center`}>
            <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row gap-10 items-center`}>
            { isPending 
                ? <h4 className='italic text-md text-slate-400 ml-10 font-light'>Loading Product {productId} ...</h4> 
                : <div className='flex flex-row items-center w-full gap-4'>
                    <div className={`text-gray-50 bg-gray-400 rounded h-10 py-2 min-w-12 text-center`}>{productId}</div>
                    <div className='flex flex-col items-start'>
                        {product && <h1 className='text-2xl text-indigo-400 font-bold'>{product.name}</h1>}
                        <p className="text-sm text-gray-500 italic">
                        Assign items with quantity and packaging details for this product
                    </p>
                    </div>
                    
                </div>
            }
            </div>
            
        </div>

        {errorMessage && <div className='text-white bg-red-500 rounded mx-10 ps-4 y-4'>
            <p>{errorMessage}</p>
        </div>}

        {isFetching
            ?  <div className='w-full text-center h-64 y-auto'><Loader /></div>
            : (product && <ProductManager 
                update={updateMapping} product={product}
                availableProducts={oldMappedProducts} />)
        }
    </div>);
}

export default AbstractProduct;