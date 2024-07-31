import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios, { AxiosError } from 'axios';

import { ItemQtyOtps, PackageQtyOtps, ProductAsset, UpdateProductAsset } from '@/App.type';

import { fetchAsset, createAsset, updateAsset, fetchAssetsForType } from '../api/api';
import ProductEntryForm from './ProductEntryForm';
import TransButton from '@/core/TransButton';
import ProductCopier from '@/components/ProductCopier';
import FoodieToggle from '@/core/FoodieToggle';
import Loader from '@/core/Loader';

const assetType = 'product';

type Product = {
    items: ItemQtyOtps[],
    packages: PackageQtyOtps[]
}

const Product = () => {
    let borderOn = false;
    // borderOn = true;

    let { productType, productId, productName } = useParams();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page');

    const [isManual, setIsManual] = useState(false);
    const [isEditActive, setIsEditActive] = useState(false);

    const [product, setProduct] = useState<Product>();
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [mappedProducts, setMappedProducts] = useState<ProductAsset[]>([]);


    const [errorMessage, setErrorMessage] = useState<string>('');

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isFetching, isPending, error, data } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            // if (productId) {
                try {
                    const data = await fetchAsset('product', productId);
                    // alert(JSON.stringify(data.data.result));
                    return data.data.result;
                } catch (err) {
                    const error = err as AxiosError;
                    throw error;
                }
            // } else {
                // return null;
            // }
        },
        staleTime: 60 * 1000,
        enabled: (page && page == 'view') ? true: false
    });

    const mutation = useMutation({
        mutationFn: async (assetItem: ProductAsset | UpdateProductAsset) => {
            try {
                let response;
                if ('name' in assetItem) {
                    response = await createAsset(assetType, assetItem);
                
                } else {
                    response = await updateAsset(assetType, assetItem.assetId, assetItem);
                }

                return response.data;
            } catch (err) {
                const error = err as AxiosError;
                throw error;
            }
        },
        onSuccess: (data, variables, context) => {
            console.log(data, variables);
            console.log('context', context)
            // Query Invalidation (Recommended)
            queryClient.invalidateQueries({ queryKey: ['asset', assetType] }); // Refetch the 'posts' query
            setErrorMessage('');
            // update(true);
          // Or, if you prefer, you can update the cache directly
          // queryClient.setQueryData(['posts'], (oldData: any) => [...oldData, data]);
        },
        onError: (error, variables, context) => {
            console.log('variables', variables);
            console.log('context', context)
          // Handle errors, e.g., display an error message to the user
            console.error('Error creating post:', error);
            setErrorMessage(JSON.stringify(error));
        //   alert(error.response.data.errorMessage);
          // You can also use `context` to rollback optimistic updates if needed
        },
    });

    const products = useQuery({
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
        enabled: (page && page == 'view') ? false: true
    });

    const createMapping = async (items: ItemQtyOtps[], packages: PackageQtyOtps[]) => {
        // alert(`Create Mapping: ${JSON.stringify(items)}`)

        if (productId && productName) {
        
            const body: ProductAsset = {
                items,
                packages,
                id: productId,
                name: productName,
                isVeg: productType == 'non-veg' ? false: true
            }
            // alert(JSON.stringify(body))

            await mutation.mutateAsync(body);

            queryClient.setQueryData(['asset', 'cache', 'product-names'], (oldData: any) => {
                // Update the old data here and return the new data
                let mapped = oldData['count#mapped'];
                let incrementedCount = mapped.data + 1;
                let update =  { ...oldData, 'count#mapped': { ...mapped, data: incrementedCount, payload: `${incrementedCount}` } };
                // alert(JSON.stringify(update));
                return update;
            });

            queryClient.setQueryData(['cache', 'product'], (oldData: any) => {
                // Update the old data here and return the new data
                let { payload } = oldData;
                let updatedPayload = [ ...payload, productId]
                let update =  { ...oldData, payload: updatedPayload };
                // alert(JSON.stringify(update));
                return update;
            });

            queryClient.setQueryData(['asset', 'product'], (oldData: any) => {
                // Update the old data here and return the new data
                let { result } = oldData;
                let updatedPayload = [ ...result, { ...body, assetId: productId }]
                let update =  { ...oldData, result: updatedPayload };
                // alert(`Adding: ${JSON.stringify({ ...body, assetId: productId })}`);
                return update;
            });

            //queryKey: ['cache', 'product'],

            navigate(-1);
        }
    }

    const updateMapping = async (items: ItemQtyOtps[], packages: PackageQtyOtps[]) => {
        // alert(`Create Mapping: ${JSON.stringify(items)}`)

        if (productId && productName) {
        
            const body: UpdateProductAsset = {
                assetId: productId,
                items,
                packages
            }
            // alert(JSON.stringify(body))

            await mutation.mutateAsync(body);
            
            queryClient.invalidateQueries({ queryKey: ['product', productId] });

            navigate(-1);
        }
    }

    

    useEffect(() => {
        if (isFetching) {
            setIsProductLoading(true)
        } else if (!isPending && error) {
            setIsProductLoading(false);
            if (axios.isAxiosError(error)) {
                setErrorMessage(`WARNING: ${error.response?.data}`);
                if (error.response && error.response.status == 404) {
                }
            } else {
                setErrorMessage(`WARNING: ${error.message}`);
            }
        } else if (!isPending && data) {
            setIsProductLoading(false);
            setProduct(data);
        } else {
            setIsProductLoading(false);
        }
    
    }, [isPending, isFetching, error, data]);

    useEffect(() => {
        if (products.isFetching) {
            setIsLoading(true)
        } else if (!products.isPending && products.error) {
            setIsLoading(false);
            if (axios.isAxiosError(products.error)) {
                setErrorMessage(`WARNING: ${products.error.response?.data}`);
                if (products.error.response && products.error.response.status == 404) {
                }
            } else {
                setErrorMessage(`WARNING: ${products.error.message}`);
            }
        } else if (!products.isPending && products.data) {
            setIsLoading(false);
            // alert(`products loaded ${JSON.stringify(products.data.result)}`)
            setMappedProducts(products.data.result);
        } else {
            setIsLoading(false);
        }
    
    }, [products.isPending, products.isFetching, products.error, products.data]);


    return (<div className='lg-w-full mx-auto'>
        <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row mx-10 my-4 justify-between items-center`}>
            <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row gap-10 items-center`}>
                <h1 className='text-xl text-indigo-400 font-extrabold'>{productName}</h1>
                <div className={`text-gray-50 bg-gray-400 rounded px-2 h-10 py-2`}>{productId}</div>
                <p className="text-sm leading-6 text-gray-600 italic">
                    Assign items with quantity and packaging details for this product
                </p>
            </div>
            {page && <FoodieToggle label='Make Editable' action={setIsEditActive} active={isEditActive} />}
        </div>
        

        {!(page && page == 'view') && <div className={`${borderOn ? 'border border-red-700': ''} mx-10 flex flex-row justify-between`}>
            <div>{!isManual && <TransButton label='Manually add items and packaging' update={() => setIsManual(true)} />}</div>
            <div>{isManual && <TransButton label='Copy from an existing product mapping' update={() => setIsManual(false)} />}</div>
        </div>}

        {errorMessage && <div className='text-red-600 bg-slate-200 rounded ps-10'>
            <p>{errorMessage}</p>
        </div>}

        {!page && isManual && productType && productId && productName && <div className='mx-10'>
            <div className='my-2'>
                {!(page && page == 'view') && <h4 className='text-slate-400 text-lg font-light'>Manually add items and packaging</h4>}
            </div>
            <ProductEntryForm readOnly={false} update={createMapping} />
        </div>}

        {page && page == 'view' && productType && productId && productName && <div 
            className=' flex items-center justify-center min-h-48'>
            {isProductLoading 
                ? <Loader />
                : <ProductEntryForm readOnly={!isEditActive? true: false} product={product} update={updateMapping} />
            }
        </div>}

        {(!page || page != 'view') && !isManual && productName? (isLoading 
            ? <span className='ml-20 italic text-sm text-slate-400'>Loading available products.....</span>
            : <ProductCopier productName={productName} availableProducts={mappedProducts} update={createMapping} />): ''}

    </div>);
}

export default Product;