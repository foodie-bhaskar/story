import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios, { AxiosError } from 'axios';

import { ItemQtyOtps, PackageQtyOtps, ProductAsset } from '@/App.type';

import { fetchAssetsForType, createAsset } from '../api/api';
import ProductEntryForm from './ProductEntryForm';
import TransButton from '@/core/TransButton';
import ProductCopier from '@/components/ProductCopier';

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

    const [mappedProducts, setMappedProducts] = useState<ProductAsset[]>([]);

    const [product, setProduct] = useState<Product>();
    const [isLoading, setIsLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string>('');

    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
        enabled: true
    });

    const createMapping = async (items: ItemQtyOtps[], packages: PackageQtyOtps[], tags: string[]) => {

        if (productId && productName) {
        
            const body: ProductAsset = {
                items,
                packages,
                tags,
                id: productId,
                name: productName,
                isVeg: productType == 'non-veg' ? false: true
            }
            // alert(JSON.stringify(body))

            await mutation.mutateAsync(body);

            navigate(-1);
        }
    }

    const mutation = useMutation({
        mutationFn: async (assetItem: ProductAsset) => {
            try {
                const response = await createAsset(assetType, assetItem);
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
            setMappedProducts(products.data);
        } else {
            setIsLoading(false);
        }
    
    }, [products.isPending, products.isFetching, products.error, products.data]);

    useEffect(() => {
        if (productId && mappedProducts && mappedProducts.length > 0) {
            for (let i=0; i < mappedProducts.length; i++) {
                const p = mappedProducts[i];
                if (p.assetId == productId) {
                    setProduct(p);
                    break;                      
                }
            }
        }
    }, [mappedProducts, productId])

    return (<div className='lg-w-full mx-auto'>
        <div className='flex flex-row mx-10 my-4 gap-10 items-center'>
            <h1 className='text-xl text-indigo-400 font-extrabold'>{productName}</h1>
            <div className={`text-gray-50 bg-gray-400 rounded px-2 h-10 py-2`}>{productId}</div>
            <p className="text-sm leading-6 text-gray-600 italic">
                Assign items with quantity and packaging details for this product
            </p>
        </div>
        

        {!(page && page == 'view') && <div className={`${borderOn ? 'border border-red-700': ''} mx-10 flex flex-row justify-between`}>
            <div>{!isManual && <TransButton label='Manually add items and packaging' update={() => setIsManual(true)} />}</div>
            <div>{isManual && <TransButton label='Copy from an existing product mapping' update={() => setIsManual(false)} />}</div>
        </div>}

        {errorMessage && <div className='text-red-600 bg-slate-200 rounded ps-10'>
            <p>{errorMessage}</p>
        </div>}

        {((page && page == 'view' && product) || isManual) && productType && productId && productName && <div className='mx-10'>
            <div className='my-2'>
                {!(page && page == 'view') && <h4 className='text-slate-400 text-lg font-light'>Manually add items and packaging</h4>}
            </div>
            <ProductEntryForm readOnly={page && page == 'view'? true: false} product={product} update={createMapping} />
        </div>}

        {(!page || page != 'view') && !isManual && productName? (isLoading 
            ? <span className='ml-20 italic text-sm text-slate-400'>Loading available products.....</span>
            : <ProductCopier productName={productName} availableProducts={mappedProducts} update={createMapping} />): ''}

    </div>);
}

export default Product;