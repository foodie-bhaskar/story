import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import axios, { AxiosError } from 'axios';

import { ItemQtyOtps, PackageQtyOtps, ProductAsset } from '@/App.type';

import { fetchAsset } from '../api/api';
import Loader from '@/core/Loader';
import ProductView from '@/components/ProductView';

const assetType = 'product';

type Product = {
    items: ItemQtyOtps[],
    packages: PackageQtyOtps[]
}

const Product = () => {
    let borderOn = false;
    // borderOn = true;

    let { productId } = useParams();
    
    const [product, setProduct] = useState<ProductAsset>();
    
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { isFetching, isPending, error, data } = useQuery({
        queryKey: [assetType, productId],
        queryFn: async () => {
            try {
                const data = await fetchAsset(assetType, productId);
                // alert(JSON.stringify(data.data.result));
                return data.data.result;
            } catch (err) {
                const error = err as AxiosError;
                throw error;
            }
        },
        staleTime: 60 * 1000,
        enabled: true
    });


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
            setProduct(data);
        } else {
        }
    
    }, [isPending, isFetching, error, data]);

    return (<div className='lg-w-full mx-auto'>
        <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row mx-10 my-4 justify-between items-center`}>
            <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row gap-10 items-center`}>
                {product && <h1 className='text-xl text-indigo-400 font-extrabold'>{product.name}</h1>}
                <div className={`text-gray-50 bg-gray-400 rounded px-2 h-10 py-2`}>{productId}</div>
            </div>

        </div>

        {errorMessage && <div className='text-white bg-red-500 rounded mx-10 ps-4 y-4'>
            <p>{errorMessage}</p>
        </div>}
        
        <div className='mx-auto max-w-96 items-center flex flex-col justify-center min-h-96'>
        {isFetching 
            ? <Loader /> 
            : (product && <ProductView 
                data={product} 
                btnLabel='View' 
                readOnly={true} 
                update={() => {
                    // alert('update')  
                }}
            />)
        }
        </div>
    </div>);
}

export default Product;