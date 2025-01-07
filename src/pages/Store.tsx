// import { useState, useEffect, FC } from 'react';
// import { useQuery } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
// import { Grid, _ } from 'gridjs-react';
// import { OneDArray } from 'gridjs/dist/src/types.js';
// import { ComponentChild } from 'preact';

// import { ShipmentCache, StoreDetail, Range, Shipment } from '@/App.type';
// import { formattedDate, convertDateFormat, RangeConverter as RC } from '@/lib/utils';
// import { fetchStoreCachesForType, fetchStores } from '@/api/api';
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
    // let borderOn = false;
    // borderOn = true;

    let { storeId } = useParams();
    /* const [errMsg, setErrMsg] = useState<string>();
    const [storeDetail, setStoreDetail] = useState<StoreDetail>();
    const [ range, setRange ] = useState<Range>();
    const [ consumed, setConsumed ] = useState<number>();
    const [ shipped, setShipped ] = useState<number>();
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

    return (<div className='lg-w-full mx-auto px-4 flex flex-col gap-10'>
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

        {/* <RangeBox range={{ start: '2024-11-26' }} onRangeChange={() => {}}/>
        <div className='items-center flex flex-row justify-start min-h-16 gap-10'>
            <Count label='Shipped Packets' count={shipped} isLoading={!isAllQueriesComplete} />
            <Count label='Consumed Packets' count={consumed} isLoading={elastic.isPending} />
        </div>

        {storeShipments && <ShipmentsTable shipments={storeShipments} />} */}
    </div>);
}

export default Store;