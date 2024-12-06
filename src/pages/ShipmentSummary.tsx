import { FC, useEffect, useState, useMemo } from "react";
import { NavigateFunction, useParams } from 'react-router-dom';
import { convertToDayNameFormat, convertISOToISTFormat } from '@/lib/utils';
import { ProductionBatchCache, PacketItemQty } from "@/App.type";
import { fetchCachesForRange, fetchStores, fetchItemPacket } from '../api/api';
import { useQueries } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Loader from "@/core/Loader";
import Count from '@/core/Count';
import BatchSummary from "@/components/BatchSummary";
import { useNavigate } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';

interface SummaryProps {
  cache: ShipmentRow,
  nav: NavigateFunction
}

type StoreDetail = {
  store_id: string;
  storeName: string;
  city: string;
}

type ItemPacketDetail = {
  itemId: string,
  name: string,
  weight: number
}

interface ItemNameQtyMap {
  [key: string]: number;
}

interface ShipmentCache {
  data: number,
  payload: ItemNameQtyMap,
  createdAt: string,
  updatedAt?: string,
  storeId: string,
  type: string
  group: string,
  distinctItems?: number
  isPending?: boolean
}

type ShipmentRow = {
  shipmentId: string;
  shippedDate: string,
  storeId: string;
  packetCount: number,
  itemCount: number
  scannedTime: string,
  weight: number,
  storeDetail?: StoreDetail,
  payload: ItemNameQtyMap
}

type StoreCache = {
  [key: string]: StoreDetail;
}

type ItemsCache = {
  [key: string]: ItemPacketDetail;
}

export const useCombinedQueries = (shipmentId: string | undefined) => {
  const [shipmentQuery, storeDetailsQuery, itemPacketQuery] = useQueries({
    queries: [
      {
        queryKey: ['cache', 'shipment', shipmentId],
        queryFn: async () => {
          try {
              if (shipmentId) {
              const data = await fetchCachesForRange('shipment', [shipmentId]);

              // alert(JSON.stringify(data.data.result[0].payload))
              
              const rows = data.data.result.map((row: ShipmentCache) => {
                
                const {
                  group, storeId, data, distinctItems, createdAt, payload
                } = row;

                const [shpDtSuffix, ] = group.split('#');
                const shpmnt: ShipmentRow = {
                  shipmentId: group,
                  storeId,
                  packetCount: data,
                  itemCount: distinctItems || 0,
                  shippedDate: shpDtSuffix.substring(4),
                  scannedTime: createdAt,
                  weight: 0,
                  payload
                }
                return shpmnt;
              });
              // alert(JSON.stringify(rows[0]));
              return rows;
            }
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true
      },
      {
        queryKey: ['cache', 'store-details'],
        queryFn: async () => {
          try {
            const data = await fetchStores();
  
            const storeMap: StoreCache = data.data.result[0].payload;
            return storeMap;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true
      },
      {
        queryKey: ['cache', 'items-packet'],
        queryFn: async () => {
          try {
            const data = await fetchItemPacket();
  
            const itemMap: ItemsCache = data.data.result[0].payload;
            return itemMap;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true
      }
    ]
  });

  // Ensure both queries are complete before merging
  const mergedData = useMemo(() => {
    // Check if both queries are successful and have data
    if (
      shipmentQuery.isSuccess && 
      storeDetailsQuery.isSuccess && 
      itemPacketQuery.isSuccess && 

      shipmentQuery.data && 
      itemPacketQuery.data && 
      storeDetailsQuery.data
    ) {
      return shipmentQuery.data.map((shipment: ShipmentRow) => {
        const { payload } = shipment;

        let weightInGms = 0;

        for (const [itemIdName, qty] of Object.entries(payload)) {
          const [itemId, ] = itemIdName.split('-');
          const packetWt = itemPacketQuery.data[itemId].weight * qty;
          weightInGms += packetWt
        }

        return {
          ...shipment,
          weight: weightInGms,
          storeDetail: storeDetailsQuery.data[shipment.storeId] || null
        };
      });
    }

    // Return empty array or original data if queries are not complete
    return [];
  }, [
    shipmentQuery.isSuccess, 
    storeDetailsQuery.isSuccess, 
    itemPacketQuery.isSuccess, 
    shipmentQuery.data, 
    storeDetailsQuery.data,
    itemPacketQuery.data
  ]);

  return {
    shipment: {
      data: mergedData,
      originalData: shipmentQuery.data,
      isPending: shipmentQuery.isPending,
      isFetching: shipmentQuery.isFetching,
      error: shipmentQuery.error
    },
    storeDetails: {
      data: storeDetailsQuery.data,
      isPending: storeDetailsQuery.isPending,
      isFetching: storeDetailsQuery.isFetching,
      error: storeDetailsQuery.error
    },
    itemPackets: {
      data: itemPacketQuery.data,
      isPending: itemPacketQuery.isPending,
      isFetching: itemPacketQuery.isFetching,
      error: itemPacketQuery.error
    },
    isAllQueriesComplete: shipmentQuery.isSuccess && storeDetailsQuery.isSuccess && itemPacketQuery.isSuccess
  };
};

const Summary: FC<SummaryProps> = ({ cache }) => {
    let borderOn = false;
    // borderOn = true;

    const { 
      shipmentId, storeId, packetCount, itemCount, shippedDate, scannedTime, weight, storeDetail
    } = cache;



    // alert(JSON.stringify(storeDetail))

    // let [ shpDate, storeId] = group.split('#');

    const [, time] = convertISOToISTFormat(scannedTime).split(',');

    return <div>
      <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row gap-8 mb-10`}>
        <div className='flex flex-col justify-evenly min-h-max'>
          <h1 className={`${borderOn ? 'border border-red-700': ''} text-lg text-slate-600 font-semibold uppercase flex flex-col items-start px-2 gap-4`}>
            <div className="text-2xl text-cyan-700 font-semibold">{shipmentId}</div>
            <div className="text-s font-light">{convertToDayNameFormat(shippedDate.substring(4))}</div>
    
          </h1>
          <span className="w-80 inline-block text-8xl font-bold text-gray-500 text-start align-middle">{time}</span>
        </div>
          
       {/*  <Count label='Store ID' count={parseInt(storeId)} isID={true} /> */}
        
        <Count label='Total Packets' count={packetCount} />
        
        <Count label='Weight' count={parseFloat((weight/1000).toFixed(2))} />

        <Count label='Items' count={itemCount} />
      </div>
      <div className="flex flex-row justify-between text-xl text-gray-100 bg-slate-600 h-12 mr-4 border rounded px-4 py-2">
        <div>Store # {storeId}</div>
        {storeDetail && <>
          <div>{storeDetail.storeName}</div>
          <div>{storeDetail.city}</div>
        </>}
      </div>
    </div>

}

const ShipmentSummary = () => {
    let { shipmentId } = useParams();
    

    let borderOn = false;
    // borderOn = true;

    const nav =  useNavigate();
    const [shipmentDetails, setShipmentDetails] = useState<ShipmentRow>();
  
    const [batch, setBatch] = useState<ProductionBatchCache>();
    const { shipment, isAllQueriesComplete } = useCombinedQueries(shipmentId);

    /* const shipmentQuery = useQuery({
        queryKey: ['cache', 'shipment', shipmentId],
        queryFn: async () => {
          try {
            if (shipmentId) {
              // const id = restoreHashMarks(shipmentId);
                const data = await fetchCachesForRange('shipment', [shipmentId]);
                // alert(JSON.stringify(data.data));
                const rows = data.data.result;
                // alert(JSON.stringify(rows));
            
                return rows;
            }
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true,
        refetchInterval: 1000 * 60
    }); */

    useEffect(() => {
      if (!isAllQueriesComplete) {
        
      } else {
        if (shipment.error) {
          if (axios.isAxiosError(shipment.error)) {
            // alert(error.response?.data);
            // if (error.response && error.response.status == 404) {
            // }
          }
        } else if (shipment.data && shipment.data.length > 0) {
          // alert(JSON.stringify(Object.keys(shipment.data[0])));
         /*  const { 
            shipmentId, storeId, packetCount, itemCount, shippedDate, scannedTime, payload, weight, storeDetails 
          } = shipment.data[0]; */
            // setLabel('Create Another Batch');
            setShipmentDetails(shipment.data[0]);

           

            // alert(JSON.stringify(payload));
            const { 
              packetCount, scannedTime, payload
            } = shipment.data[0];

            const itemPktCount: Record<string, string> = payload;
            
            const items = Object.entries(itemPktCount).map(([idName, count]) => {
              const [itemId, name] = idName.split('-');
              const pktQty: PacketItemQty = { itemId: parseInt(itemId), name, qty: parseInt(count) }
              return pktQty;
            });

            // alert(createdAt);

            // const batchNo: number | undefined = 1;
            const batchPackets: number = packetCount;

            const shipmentDetailsQty: ProductionBatchCache = {
              batchNo: 1,
              batchPackets,
              batchTime: scannedTime,
              items 
            }

            setBatch(shipmentDetailsQty);
          
        }
      }
  
    }, [isAllQueriesComplete, shipment.isPending, shipment.isFetching, shipment.error, shipment.data]);

    useEffect(() => {
      window.scrollTo(0, 0)
    }, []);

   /*  useEffect(() => {
      // alert(`Shipment changed, refetching....: ${shipmentId}`);
      shipment.refetch();
    }, [shipmentId]); */

    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-4 mt-4 min-h-screen overflow-y-scroll`}>
        {shipmentId && <>
            {shipment.data && !shipment && <h1 className={`${borderOn ? 'border border-red-700': ''} text-lg text-slate-600 font-semibold uppercase flex items-center`}>
                No such shipment {shipmentId}
            </h1>}

            <div className={`${borderOn ? 'border border-red-700': ''} min-h-96 mb-24`}>
              {shipment.isFetching 
                    ? <div className='h-96 text-center align-middle'><Loader /></div>
                    : shipment 
                      ? <div className="pt-4">
                        {shipmentDetails && <Summary cache={shipmentDetails} nav={nav} />}
                        {batch && <BatchSummary {...batch} />}
                      </div>
                      : <div className="pt-4 h-20 flex flex-row gap-6 items-center">
                          <CircleAlert className="w-18 h-18 text-orange-400" />
                            <span className="text-start text-gray-400 italic font-light text-2xl">
                              No such shipment
                            </span>
                      </div>
                }
            </div>
        
        </>}
        {!shipmentId && <h1>Invalid Shipment Id</h1>}
        
    </div>);
}

export default ShipmentSummary;