import { FC, useState, useEffect } from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { AttemptsMap } from '../App.type';
import Agg2 from './ui/Agg2';
import TimingBar from './TimingBar';
import { useQuery } from '@tanstack/react-query';
import { fetchAssetsCache } from '../api/api';
import { AxiosError } from 'axios';

export interface StageBarProps {
    order4Digits: string;
    aggregator: string;
    storeId: string,
    acceptedTime: number,
    userAcceptedTime?: number,
    readyTime?: number,
    riderArrivedTime?: number,
    pickedUpTime?: number,
    deliveredTime?: number,
    attempts: AttemptsMap
}

interface StoreBlockProps {
    assetId: string,
    name: string,
    area?: string,
    city?: string,
    state?: string,
    owner?: string, 
    phone?: string
}

const StoreBlock: FC<StoreBlockProps> = ({ assetId, name, area, city, state, owner, phone }) => {
    return <div className='flex flex-row gap-4 mx-2 my-1 border border-slate-400 w-96 justify-between p-4 h-32'>
        <div className='text-xl font-semibold text-indigo-950'>
            <div>{assetId} - {name}</div>
            <div><span className='italic text-slate-400'>{area}</span></div>
            <div>{city} (<span className='italic'>{state}</span>)</div>
        </div>
        
        <div>
            <div>{owner}</div>
            <div>{phone}</div>
        </div>
    </div>
}

const StageBar: FC<StageBarProps> = ({ attempts, order4Digits, aggregator, storeId, acceptedTime, 
    userAcceptedTime, readyTime, riderArrivedTime, pickedUpTime, deliveredTime }) => {
        let stage = 'OK';

        const [ storeDetails, setStoreDetails ] = useState<StoreBlockProps>();

        const store = useQuery({
            queryKey: ['asset', 'store'],
            queryFn: async () => {
                try {
                    const data = await fetchAssetsCache('store');
        
                    const storeMap = data.data.result;
                    // alert(`Got stores: ${storeMap.length}`);
                    
                    return storeMap;
                } catch (err) {
                    const error = err as AxiosError;
                    throw error;
                }
            },
            staleTime: Infinity,
            enabled: true
        });

        const [expandedRows, setExpandedRows] = useState(false);



    if ((!readyTime && !pickedUpTime) || !userAcceptedTime) {
        stage = !userAcceptedTime ? 'RED': 'GRAY'
    }
    // alert(`${order4Digits} attempts : ${JSON.stringify(attempts)}`);
    const borderBackgrounds: { [key: string]: string } = {
        OK: '',
        GRAY: 'border-green-400 border-2 bg-green-50',
        // GRAY: 'border-red-300 border-2 bg-red-100',
        RED: 'border-red-300 border-4 bg-red-100',
        TEST1: 'bg-green-400',
        TEST2: 'border-violet-700',
        TEST3: 'text-violet-700',
        TEST4: 'border-indigo-900',
        TEST5: 'text-indigo-900',
        TEST6: 'border-teal-700',
        TEST7: 'text-teal-700',
        TEST8: 'bg-green-400'
    }
    const time = new Date();
    time.setTime(acceptedTime);

    useEffect(() => {
        if (store.data) {

            const storeDtl = store.data.find(s => s.assetId == storeId);

            if (storeDtl) {
                let s = storeDtl as unknown as StoreBlockProps;
                setStoreDetails(s)
            }
        }

    }, [store.isPending, store.data])
    return <div 
        className={`shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg
        hover:bg-blue-200 cursor-pointer hover:border-2 hover:border-blue-800 hover:rounded 
            hover:min-h-20 min-h-20 max-h-64 pt-1`}>
        <div className='flex flex-row w-full item items-center h-18'  onClick={() =>setExpandedRows(true)}>
             <div 
                className="text-center flex items-center justify-center text-2xl px-1 font-bold leading-tight text-slate-600 h-18"
                style={{fontFamily: 'Orbitron, monospace'}}
            >{time.toLocaleTimeString('en-GB', { timeStyle: 'short' })}</div>
            <div className={`w-full p-2 ${borderBackgrounds[stage]} items-center flex flex-row gap-4 h-18 rounded justify-between align-middle`}>
                <Agg2 type={aggregator} orderId={order4Digits} />
                <TimingBar startTime={acceptedTime} stageTimes={{
                        userAcceptedTime, readyTime, riderArrivedTime, pickedUpTime, deliveredTime
                }} attempts={attempts} />
                <div className={`w-20 text-center flex items-center justify-center font-semibold leading-tight h-12 
                    rounded text-white
                bg-slate-400`}
                
                >
                    <BuildingStorefrontIcon className='size-4' /> <span className='text-2xl block'>{storeId}</span></div>
            </div>
        </div>
        {expandedRows && <div className="h-44 p-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 animate-in slide-in-from-top duration-300">
            {store.isLoading && <p className='mx-auto'>Loading store details</p>}
                {!store.isLoading && store.data && storeDetails != undefined 
                    && <div className='flex flex-row gap-10 items-center'>
                            <StoreBlock assetId={storeDetails.assetId}
                                name={storeDetails.name} area={storeDetails.area} city={storeDetails.city} state={storeDetails.state}
                                owner={storeDetails.owner} phone={storeDetails.phone}
                            />
                            <div className={`h-8 w-8 rounded-full bg-slate-500 border-2 border-white flex items-center justify-center shadow-md`}>
                                <XMarkIcon className='size-4 text-white ' onClick={() => setExpandedRows(!expandedRows)}/>
                            </div>
                        </div>
            }    
        </div>}
    </div>
}

export default StageBar;