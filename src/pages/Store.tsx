import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery, UseQueryResult } from '@tanstack/react-query';
// import axios from 'axios';

import { Range } from '@/App.type';
import { dateRangeTS } from '@/lib/utils';

// import Count from '@/core/Count';
// import DisplayTable, { transformConsumableSummary } from '@/components/DisplayTable';
import CombinedQueryTable from '@/components/CombinedQueryTable';
import RangeBox from '@/components/RangeBox';


// import { queryStoresCache, queryStoreShipments, queryElastic } from '@/queries/query';
// import { useStoreQueries } from '@/hooks/combinedQuery';
// import Loader from '@/core/Loader';
// import Count from '@/core/Count';

const Store = () => {
    let borderOn = false;
    // borderOn = true;

    let { storeId } = useParams();    
    const nav =  useNavigate();

    const [ range, setRange ] = useState<Range>(dateRangeTS(14));
    /* 

    const [ shipped, setShipped ] = useState<number>();
    const [ consumed, setConsumed ] = useState<number>(); */


    /* const [errMsg, setErrMsg] = useState<string>();
    const [storeDetail, setStoreDetail] = useState<StoreDetail>();
    const [ range, setRange ] = useState<Range>();
    const [ consumed, setConsumed ] = useState<number>();
    
    const [ storeShipments, setStoreShipments ] = useState<Shipment []>();

    const {
        mergedData,
        isAllQueriesComplete
    } = useStoreQueries(storeId); */

    //// ['elastic', 'item-consumption', 'storeId#79', 'isPacket#true', '2024-11-26#2024-12-27']
    /* const elastic = useQuery({
        queryKey: [
            'elastic', 
            'item-consumption', 
            storeId ? `storeId#${storeId}`: '', 
            'isPacket#true',
            range ? RC.toString(range): ''
        ],
        queryFn: queryElastic,
        staleTime: Infinity,
        enabled: isAllQueriesComplete && (!!range)
    });

    useEffect(() => {
        if(isAllQueriesComplete && mergedData) {
            const { shipDates, shipments } = mergedData;

            const toDate = formattedDate();
            const range = {
                start: shipDates[0],
                end: toDate
            }

            setRange(range);

            const totalPackets = shipments.reduce((acc: number, s: Shipment) => {
                const { packets, shippedDate } = s;

                if (shippedDate <= toDate) {
                    acc += packets;
                }
                return acc;
            }, 0);

            setShipped(totalPackets);
            setStoreShipments(shipments)
            // alert(`Total packets : ${totalPackets}`);
        }

    }, [isAllQueriesComplete, mergedData]); */

 /*    useEffect(() => {
        // elastic.refetch();
        if (range) {
            alert(`Filtering for range: ${JSON.stringify(range)}`)
            // alert(`Filtering for range: ${Object.values(range).join('#')}`)
        }
    }, [storeId, range]) */
    
    /* useEffect(() => {
        // alert(`fetching elastic`);
        if (elastic.isPending) {
        //   setIsRefetchingProducts(true);
        } else {
            // alert('All queries loaded')
            if (elastic.error) {
                setErrMsg(`WARNING: ${elastic.error.message}`);
            } else if (elastic.data) {
                // alert(JSON.stringify(elastic.data['total_quantity']));
                setConsumed(elastic.data['total_quantity'].value)
            }
        }
    }, [elastic.isPending, elastic.error, elastic.data]); */

    return (<div className={`${borderOn ? 'border border-red-700': ''} w-full overflow-y-scroll min-h-screen`}>
        <div className="flex flex-row justify-between font-semibold text-2xl text-gray-100 bg-slate-600 h-12 py-4 px-8">
          <div>Store # {storeId}</div>
        {/* {!isAllQueriesComplete && <Loader size={8}/>} */}
        {/* {stores.error && errMsg && <div className='text-white bg-red-500 rounded mx-10 ps-4 y-4'>
            <p>{errMsg}</p>
        </div>} */}
        {/* {isAllQueriesComplete && mergedData && <>
          <div>{mergedData.storeDetail.storeName}</div>
          <div>{mergedData.storeDetail.city} ({mergedData.storeDetail.state})</div>
        </>} */}
        </div>

        <div className="p-4">
            <RangeBox range={range} onRangeChange={setRange} />
        {/* <div className='items-center flex flex-row justify-start min-h-16 gap-10'>
            <Count label='Shipped Packets' count={shipped} isLoading={apiQuery.isFetching} />  
            <Count label='Consumed Packets' count={consumed} isLoading={elastic.isPending} />
        </div> */}

        {/* <RangeBox range={{ start: '2024-11-26' }} onRangeChange={() => {}}/>
        <div className='items-center flex flex-row justify-start min-h-16 gap-10'>
            <Count label='Shipped Packets' count={shipped} isLoading={!isAllQueriesComplete} />
            <Count label='Consumed Packets' count={consumed} isLoading={elastic.isPending} />
        </div>

         */}

            {range && <CombinedQueryTable type='store-packetflow' range={range} nav={nav} borderOn={borderOn} storeId={storeId} limit={100} />}
        </div>
    </div>);
}

export default Store;