import { FC, useEffect, useState } from "react";
import { NavigateFunction, useParams } from 'react-router-dom';
import { convertToDayNameFormat, convertISOToISTFormat } from '@/lib/utils';
import { Cache, ProductionBatchCache, PacketItemQty } from "@/App.type";
import { fetchCachesForRange } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Loader from "@/core/Loader";
import Count from '@/core/Count';
import BatchSummary from "@/components/BatchSummary";
import { useNavigate } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';

interface SummaryProps {
  cache: Cache,
  nav: NavigateFunction
}

const Summary: FC<SummaryProps> = ({ cache }) => {
    let borderOn = false;
    // borderOn = true;

    const { data, createdAt, distinctItems, group } = cache;

    const [ shpDate, storeId] = group.split('#');

    const [, time] = convertISOToISTFormat(createdAt).split(',');

    return <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row gap-8 mb-10`}>
        <div className='flex flex-col justify-evenly min-h-max'>
          <h1 className={`${borderOn ? 'border border-red-700': ''} text-lg text-slate-600 font-semibold uppercase flex flex-col items-start px-2 gap-4`}>
            <div className="text-2xl text-cyan-700 font-semibold">{group}</div>
            <div className="text-s font-light">{convertToDayNameFormat(shpDate.substring(4))}</div>
    
          </h1>
          <span className="w-80 inline-block text-8xl font-bold text-gray-500 text-start align-middle">{time}</span>
        </div>

        <Count label='Store ID' count={parseInt(storeId)} isID={true} />
        
        <Count label='Total Packets' count={data} />

        <Count label='Items' count={distinctItems} />

    </div>

}

const ShipmentSummary = () => {
    let { shipmentId } = useParams();
    

    let borderOn = false;
    // borderOn = true;

    const nav =  useNavigate();
    const [shipment, setShipment] = useState<Cache>();
  
    const [batch, setBatch] = useState<ProductionBatchCache>();

    const shipmentQuery = useQuery({
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
    });

    useEffect(() => {
      if (shipmentQuery.isFetching) {
        
      } else {
        if (shipmentQuery.error) {
          if (axios.isAxiosError(shipmentQuery.error)) {
            // alert(error.response?.data);
            // if (error.response && error.response.status == 404) {
            // }
          }
        } else if (shipmentQuery.data) {
          // alert(JSON.stringify(shipmentQuery.data[0].storeId));
          if (shipmentQuery.data.length > 0) {
            // setLabel('Create Another Batch');
            setShipment(shipmentQuery.data[0]);

            const { data, payload, createdAt } = shipmentQuery.data[0];

            // alert(JSON.stringify(payload));

            const itemPktCount: Record<string, string> = payload;
            
            const items = Object.entries(itemPktCount).map(([idName, count]) => {
              const [itemId, name] = idName.split('-');
              const pktQty: PacketItemQty = { itemId: parseInt(itemId), name, qty: parseInt(count) }
              return pktQty;
            });

            // alert(createdAt);

            // const batchNo: number | undefined = 1;
            const batchPackets: number = data;

            const shipmentDetails: ProductionBatchCache = {
              batchNo: 1,
              batchPackets,
              batchTime: createdAt,
              items 
            }

            setBatch(shipmentDetails);
          }
        }
      }
  
    }, [shipmentQuery.isPending, shipmentQuery.isFetching, shipmentQuery.error, shipmentQuery.data]);

    useEffect(() => {
      window.scrollTo(0, 0)
    }, []);

    useEffect(() => {
      // alert(`Shipment changed, refetching....: ${shipmentId}`);
      shipmentQuery.refetch();
    }, [shipmentId]);

    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-4 mt-4 min-h-screen overflow-y-scroll`}>
        {shipmentId && <>
            {shipmentQuery.data && !shipment && <h1 className={`${borderOn ? 'border border-red-700': ''} text-lg text-slate-600 font-semibold uppercase flex items-center`}>
                No such shipment {shipmentId}
            </h1>}

            <div className={`${borderOn ? 'border border-red-700': ''} min-h-96 mb-24`}>
              {shipmentQuery.isFetching 
                    ? <div className='h-96 text-center align-middle'><Loader /></div>
                    : shipment 
                      ? <div className="pt-4">
                        <Summary cache={shipment} nav={nav} />
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