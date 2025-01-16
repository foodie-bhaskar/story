import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

import { Row, Mapping, Range, ConsumableQueryResult } from '@/App.type';
import { dateRangeTS, RangeConverter as RC } from '@/lib/utils';
import { MAP } from "@/lib/helper";
import { queryConsumables, queryElastic } from '@/queries/query';

import Count from '@/core/Count';
import DisplayTable, { transformConsumableSummary } from '@/components/DisplayTable';
import RangeBox from '@/components/RangeBox';

// import { useState, useEffect, FC } from 'react';


// import { Grid, _ } from 'gridjs-react';
// import { OneDArray } from 'gridjs/dist/src/types.js';
// import { ComponentChild } from 'preact';


// import { formattedDate, convertDateFormat, RangeConverter as RC } from '@/lib/utils';

// import { queryStoresCache, queryStoreShipments, queryElastic } from '@/queries/query';
// import { useStoreQueries } from '@/hooks/combinedQuery';
// import Loader from '@/core/Loader';
// import Count from '@/core/Count';
// import RangeBox from '@/components/RangeBox';

/* type Mapping = {
    order: OneDArray<ComponentChild>
} */

/* const assetType = 'product';

type Product = {
    items: ItemQtyOtps[],
    packages: PackageQtyOtps[]
} */


/* const ShipmentsTable: FC<{ shipments: Shipment[]}> = ({ shipments }) => {

    // const [tableData, setTableData] = useState<Shipment []>();
    // const [tableData, setTableData] = useState();
    const [tableData, setTableData] = useState<Shipment[] | undefined>();
    const nav =  useNavigate();
    const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);

    function getMappings(assetType: string, nav: Function): Mapping {
        // alert(assetType);
        let mappings: any = [];
        switch (assetType) {
  
          
          case 'shipment': 
            // alert('shipment')
            try {
              mappings = {
                order: [
                  { 
                    name: 'Ship Date', 
                    id: 'shippedDate',
                    formatter: (cell: string) => _(<div className="flex justify-center">
                      <div className="font-light text-gray-500">{convertDateFormat(cell)}</div>       
                      <div className="font-light text-gray-500">{cell}</div>       
                    </div>)
                  },
                  { 
                    name: 'Shipment ID', 
                    id: 'shipmentId',
                    formatter: (cell: string) => _(<div className="flex justify-start">     
                    <div className="font-light text-gray-500">{cell}</div>          
                      <LinkButton label={cell} to={replaceHashMarks(cell)} nav={nav} />
                    </div>)
                  },
                  { name: 'Packets', id: 'packets', formatter: (cell: number) => _(
                    <div className="text-center">
                      <div className="font-light text-gray-500">{cell}</div>
                    </div>
                  )},
                  { name: 'Items', id: 'items', formatter: (cell: number) => _(
                    <div className="text-center">
                      <div className="font-light text-gray-500">{cell}</div>
                    </div>
                  )}
                ]
              }
            } catch (e) {
              alert(e);
              // alert(JSON.stringify(e));
            }
            return mappings;
      
          default:
            return {
              order: ['']
            }
        }
    }

    function getColumns(assetType: string, nav: Function) {
        let colsInOrder = getMappings(assetType, nav);
        return colsInOrder;
    }


    useEffect(() => {
        if (shipments && shipments.length) {
            // alert(JSON.stringify(shipments[0]));
            setTableData(shipments);
            let cols: Mapping = getColumns('shipment', nav);
            setColumns(cols.order);
            // alert('cols.order')

        }
      }, [shipments]);

    return <div>
       {shipments && tableData && <div className="pt-4">
            <h4>{shipments.length} shipments</h4>
            <Grid
              data={tableData}
              columns={columns}
              search={true}
              pagination={{
                limit: 7,
              }}
              fixedHeader={true}
              style={ { 
                table: { 
                  'white-space': 'nowrap',
                  'width': '100%'
                }
              }}
              sort={true}
              resizable={true}
              className={{  
                td: 'w-auto',
                tr: 'min-w-max'
              }}
            />
        </div>}
    </div>
} */

const Store = () => {
    let borderOn = false;
    borderOn = true;

    let { storeId } = useParams();    
    const nav =  useNavigate();

    const [ range, setRange ] = useState<Range>(dateRangeTS(14));
    const [tableData, setTableData] = useState<Row []>();
    const [columns, setColumns] = useState<Mapping>();

    const consumableType = 'PACKET';

    // const data = await fetchConsumables('PACKET', 'storeId', storeId, range, true);

    const elastic = useQuery({
      queryKey: ['elastic', 'item-consumption', `storeId#${storeId}`, 'isPacket#true', RC.toString(range), 'itemId'],
      queryFn: queryElastic,
      staleTime: 60 * 1000,
      enabled: !!storeId && !!range
    });

    const apiQuery: UseQueryResult<ConsumableQueryResult> = useQuery({
      queryKey: ['consumable', consumableType, `storeId#${storeId}`, RC.toString(range), 'true'],
      queryFn: queryConsumables,
      staleTime: Infinity,
      enabled: !!storeId && !!range
    });

    const [ shipped, setShipped ] = useState<number>();
    const [ consumed, setConsumed ] = useState<number>();

    useEffect(() => {
      if (apiQuery.error) {
        if (axios.isAxiosError(apiQuery.error)) {
          alert(apiQuery.error.response?.data);
          if (apiQuery.error.response && apiQuery.error.response.status == 404) {
          }
        }
      } else if (apiQuery.data) {
        setShipped(apiQuery.data.count);
        const { cols, rows } = transformConsumableSummary('packet-flow', apiQuery.data.summary, nav, MAP);

        
          setColumns(cols);
          setTableData(rows);
  
      }
    }, [apiQuery.isFetching, apiQuery.isPending, apiQuery.error, apiQuery.data]);

    useEffect(() => {
      if (elastic.error) {
        if (axios.isAxiosError(elastic.error)) {
          alert(elastic.error.response?.data);
          if (elastic.error.response && elastic.error.response.status == 404) {
          }
        }
      } else if (elastic.data) {
        setConsumed(elastic.data.total);
        // const { cols, rows } = transformConsumableSummary('packet-flow', elastic.data.summary, nav, MAP);

        
          // setColumns(cols);
          // setTableData(rows);
  
      }
    }, [elastic.isFetching, elastic.isPending, elastic.error, elastic.data]);

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

    return (<div className={`${borderOn ? 'border border-red-700': ''} min-w-screen min-h-screen overflow-y-scroll`}>
        <div className="-mx-4 flex flex-row justify-between font-semibold text-2xl text-gray-100 bg-slate-600 h-12 border px-8 py-2">
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

        <RangeBox range={range} onRangeChange={setRange} />
        <div className='items-center flex flex-row justify-start min-h-16 gap-10'>
            <Count label='Shipped Packets' count={shipped} isLoading={apiQuery.isFetching} />  
            <Count label='Consumed Packets' count={consumed} isLoading={elastic.isPending} />
        </div>

        {/* <RangeBox range={{ start: '2024-11-26' }} onRangeChange={() => {}}/>
        <div className='items-center flex flex-row justify-start min-h-16 gap-10'>
            <Count label='Shipped Packets' count={shipped} isLoading={!isAllQueriesComplete} />
            <Count label='Consumed Packets' count={consumed} isLoading={elastic.isPending} />
        </div>

        {storeShipments && <ShipmentsTable shipments={storeShipments} />} */}

      {apiQuery.isSuccess && !!apiQuery.data && !!tableData && columns 
        && <DisplayTable tableData={tableData} cols={columns} limit={30} />}
    </div>);
}

export default Store;