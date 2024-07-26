import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '@/core/Loader';
import { fetchAsset, updateAsset } from '../api/api';
import Wrapper from '@/components/AssetWrapper';
import { AssetTypes, FormType, WrapperContent, UpdatePackageAsset } from '@/App.type';

const EditAsset = () => {
    let { assetType, assetId } = useParams();

    const [errorMessage, setErrorMessage] = useState<string>();
    const [type, setType] = useState<AssetTypes>();
    const [name, setName] = useState('');
    const [content, setContent] = useState<WrapperContent>();

    const { isPending, error, data } = useQuery({
        queryKey: [assetType, assetId],
        queryFn: async () => {
            if (assetType && assetId) {
                try {
                    const data = await fetchAsset(assetType, assetId);
                    // alert(JSON.stringify(data.data.result));
                    return data.data.result;
                } catch (err) {
                    const error = err as AxiosError;
                    throw error;
                }
            } else {
                return null;
            }
        },
        staleTime: 60 * 1000
    });

    const queryClient = useQueryClient();
    const navigate =  useNavigate();

    const mutation = useMutation({
        mutationFn: async (assetItem: UpdatePackageAsset) => {
            try {
                if (assetType && assetId) {
                    const response = await updateAsset(assetType, assetId, assetItem);
                    return response.data;
                }
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
            queryClient.invalidateQueries({ queryKey: [assetType, assetId] }); // Refetch the 'posts' query
        
            // Or, if you prefer, you can update the cache directly
            // queryClient.setQueryData(['posts'], (oldData: any) => [...oldData, data]);
        },
        onError: (error, variables, context) => {
            console.log('variables', variables);
            console.log('context', context)
            // Handle errors, e.g., display an error message to the user
            console.error('Error creating post:', error);
            alert(JSON.stringify(error));
        //   alert(error.response.data.errorMessage);
          // You can also use `context` to rollback optimistic updates if needed
        },
    });

    const update = async (obj: any) => {
        // alert(JSON.stringify(obj));

        let assetItem = {};

        if (assetType == 'package') {

            const { 
                compartments, 
                pkgCost, capacity,
                packagingTypeCombo 
            } = obj;

            assetItem = {
                packagingTypeCombo,
                compartments,
                packagingCost: pkgCost,
                volume: capacity,
            }
        } else {
            const { name, isVeg, vendor, isPacket, weight, costBuildup, typeCombo, cuisineCombo } = obj;
            assetItem = {
                name,
                isVeg,
                vendor,
                isPacket,
                weight,
                costBuildup,
                typeCombo,
                cuisineCombo
            }
        }

        // alert(`Edit: ${JSON.stringify(assetItem)}`);
        let updateResponse = await mutation.mutateAsync(assetItem);
        console.log(JSON.stringify(updateResponse));
        // alert(JSON.stringify(updateResponse));
        navigate(`/list-assets/${assetType}`)
    }

    useEffect(() => {
        if (assetType && Object.values(AssetTypes).includes(assetType as AssetTypes)) {
            const enumValue = assetType as AssetTypes; 
            // console.log(enumValue); // Output: AssetTypes.PACKAGE
            setType(enumValue);
        }

    }, [assetType])
    
    useEffect(() => {
        if(error) {
            setErrorMessage(error.message);
        } else if (data) {
            // alert(JSON.stringify(data));
            setErrorMessage('');
            setName(data.name);

            let ct = {
                ...(assetType == 'package' && { package: {
                    pkg: data,
                    formType: FormType.EDIT,
                    callbackFn: update
                }}),
                ...(assetType == 'item' && { item: {
                    item: data,
                    formType: FormType.EDIT,
                    callbackFn: update
                }}),
            }

            let temp = { ...content, ...ct };
            
            setContent(temp)
        }

    }, [isPending, error, data])

    return(<div className="ml-20 pt-10">
        <div className='flex flex-row gap-8 mb-10 text-gray-500'>
            <span className='uppercase text-lg font-light'>edit {assetType}: </span>
            <h2 className="text-xl uppercase font-semibold leading-7 "> {name} </h2>
        </div>
        
        {errorMessage && <div className='text-red-600 bg-slate-200 rounded ps-10 my-10 py-4'>
            <p>{errorMessage}</p>
        </div>}
        
        {mutation.isError && (
            <p>Error: {mutation.error && axios.isAxiosError(mutation.error)? mutation.error.response?.data.errorMessage : 'An error occurred'}</p>
        )}
        {mutation.isPending && <Loader />}
        
        {isPending && <Loader />}

        {data && type && content && <Wrapper type={type} content={content} />}
    </div>);
}

export default EditAsset;