import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '@/core/Loader';

import { fetchAsset } from '../api/api';
import Wrapper from '@/components/AssetWrapper';
import { AssetTypes, FormType, WrapperContent } from '@/App.type';

const ViewAsset = () => {
    let { assetType, assetId } = useParams();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [type, setType] = useState<AssetTypes>();
    const [name, setName] = useState('');
    const [content, setContent] = useState<WrapperContent>()

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
                    formType: FormType.VIEW
                }}),
            }

            let temp = { ...content, ...ct };
            
            setContent(temp)
        }

    }, [isPending, error, data])

    return(<div className="ml-20 pt-10">
        <div className='flex flex-row gap-8 mb-10 text-gray-500'>
            <span className='uppercase text-lg font-light'>{assetType}</span>
            <h2 className="text-xl uppercase font-semibold leading-7 ">{name} </h2>
        </div>
        
        {errorMessage && <div className='text-red-600 bg-slate-200 rounded ps-10 my-10 py-4'>
            <p>{errorMessage}</p>
        </div>}
        
        
        {isPending && <Loader />}

        {data && type && content && <Wrapper type={type} content={content} />}
    </div>);
}

export default ViewAsset;