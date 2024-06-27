import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from 'axios';

import ProductItems from '@/components/ProductItems';
import ProductPackages from '@/components/ProductPackages';
import { ItemQtyOtps, PackageQtyOtps, ProductAsset } from '@/App.type';

const assetType = 'product';

async function fetchAsset(assetType: string, id?: string) {
    if (!id) {
        throw new Error('Product Id is required');
    }
    const url = `https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset?assetType=${assetType.toUpperCase()}&id=${id}`;
    
    return axios.get(url, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
        }
    })
}

type Product = {
    items: ItemQtyOtps[],
    packages: PackageQtyOtps[]
}

async function createAsset(data: ProductAsset) {
    try {
        return axios.post(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset?assetType=${assetType.toUpperCase()}`, 
            data,
            {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
                }
            }
        );
    } catch (error) {
        throw new Error('Hello');
        // throw new Error(error.response?.data.errorMessage); // Additional error details from the server
    }
}

const Product = () => {
    let borderOn = false;
    // borderOn = true;

    let { productType, productId, productName } = useParams();
    const [product, setProduct] = useState<Product>();
    const [isLoading, setIsLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string>('');

    const [valid, setValid] = useState(false);

    const [items, setItems] = useState<ItemQtyOtps[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [packages, setPackages] = useState([]);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const addItemQty = (items: ItemQtyOtps[], tags: string[]) => {
        setItems(items)
        setTags(tags);
    }

    const mutation = useMutation({
        mutationFn: async (assetItem: ProductAsset) => {
            try {
                const response = await createAsset(assetItem);
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
            navigate(-1);
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

    const { isPending, isFetching, error, data } = useQuery({
        queryKey: ['asset', assetType, productId],
        queryFn: async () => {
          try {
            const data = await fetchAsset(assetType, productId);
            return data.data;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: !!productId
    });

    useEffect(() => {
        if (items.length && packages.length) {
            setValid(true);
        } else {
            setValid(false);
        }

    }, [items, packages])

    useEffect(() => {
        if (isFetching) {
          setIsLoading(true)
        } else if (!isPending) {
          setIsLoading(false);
    
          if (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // alert(error.response.data);
                    setErrorMessage(`WARNING: ${error.response.data}`);
                }
            } else {
            //   alert(error.message);
                setErrorMessage(error.message);
            }
          } else {
            setErrorMessage('');
            if (data.result && data.result) {
                // alert(JSON.stringify(data.result.items));
                setProduct(data.result)
            }
          }  
        }
      }, [isPending, isFetching, error, data]);

    return (<div className='lg-w-full mx-auto'>
        <div className="text-center">
            {!productId && <h4>Invalid URL, product ID is missing</h4>}
            {productId && <h2 className="text-xl uppercase font-semibold leading-7 text-gray-500 mt-10 mx-auto">
                Product: {productId} {isLoading ? '(Fetching status...)': (!product ? '(UNMAPPED)': '')}
            </h2>}
            <p className="mt-1 text-sm leading-6 text-gray-600 italic">
                Assign items with quantity and packaging details for this product
            </p>
        </div>

        {errorMessage && <div className='text-red-600 bg-slate-200 rounded ps-10'>
            <p>{errorMessage}</p>
        </div>}

        <div className='flex flex-row px-10 w-full rounded py-4 gap-10 items-center my-4 mx-10 '>
            <span className='inline-block text-xl text-slate-500 font-semibold h-10 mt-2'>{productName}</span>

            {!product && !isLoading && <button 
                type='button' 
                disabled={false}
                onClick={async () => {
                    if (productId && productName) {
                        const body: ProductAsset = {
                            items,
                            packages,
                            tags,
                            id: productId,
                            name: productName,
                            isVeg: productType == 'non-veg' ? false: true
                        }
                        alert(JSON.stringify(body))

                        await mutation.mutateAsync(body);
                    }
                }}
                className={`py-2.5 px-6 text-sm rounded uppercase h-10
                    ${valid
                          ? 'cursor-pointer text-indigo-50  bg-indigo-500 transition-all duration-500 hover:bg-indigo-700'
                          : 'cursor-not-allowed text-gray-300 bg-gray-100 '}
                        font-semibold text-center shadow-xs rounded`}>
                    Save
                </button>}
        </div>

        {!isLoading && <div className={`${borderOn ? 'border-red-800': ''} mt-10 flex flex-row h-svh min-w-max`}>
            <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} basis-6/12 border-r border-cyan-900 px-6`}>
                <ProductItems update={addItemQty} data={product? product.items: []}/>
            </main>
            <aside className=" basis-5/12 ps-10">
                <ProductPackages update={setPackages} data={product? product.packages: []} />
            </aside>
        </div>}
    </div>);
}

export default Product;